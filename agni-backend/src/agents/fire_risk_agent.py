import os
from langgraph.graph import StateGraph, MessagesState, START, END
from .tools import fire_danger
from langchain.chat_models import init_chat_model
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.prebuilt import ToolNode
from pathlib import Path
from langchain_google_genai import ChatGoogleGenerativeAI

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable is not set!")
os.environ["GEMINI_API_KEY"] = api_key

memory = InMemorySaver()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash-exp",
    google_api_key=api_key
)

# Get the path to the CSV file
tools = [fire_danger]
tool_node = ToolNode(tools=tools)

# Create graph builder
graph_builder = StateGraph(MessagesState)

# Bind tools to LLM
llm_with_tools = llm.bind_tools(tools)

def chatbot(state: MessagesState):
    return {"messages": [llm_with_tools.invoke(state["messages"])]}

# Add nodes BEFORE compiling
graph_builder.add_node("chatbot", chatbot)
graph_builder.add_node("tools", tool_node)

# Add edges
graph_builder.add_edge(START, "chatbot")
graph_builder.add_edge("tools", "chatbot")

def route_tools(state: MessagesState):
    if isinstance(state, list):
        ai_message = state[-1]
    elif messages := state.get("messages", []):
        ai_message = messages[-1]
    else:
        raise ValueError("No messages in state")
    if hasattr(ai_message, "tool_calls") and len(ai_message.tool_calls):
        return "tools"
    return END

graph_builder.add_conditional_edges(
    "chatbot",
    route_tools,
    {"tools": "tools", END: END},
)

# ✅ COMPILE AT THE END
graph = graph_builder.compile(checkpointer=memory)
    
def stream_graph_updates(user_input: str):
    events = graph.stream(
        {"messages": [{"role": "user", "content": user_input}]},
        {"configurable": {"thread_id": "1"}},
        stream_mode="values"
    )

    for event in events:
        last_message = event["messages"][-1]
        if hasattr(last_message, "content") and last_message.content:
            print("Assistant:", last_message.content)

if __name__ == "__main__":
    while True:
        user_input = input("User: ")
        if user_input.lower() in ["quit", "exit", "q"]:
            print("Goodbye")
            break
        stream_graph_updates(user_input)