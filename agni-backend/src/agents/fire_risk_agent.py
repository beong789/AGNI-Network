import os
from langgraph.graph import StateGraph, MessagesState, START, END
from tools import FireDangerTool
from langchain.chat_models import init_chat_model
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph.message import BasicToolNode

api_key = os.getenv("GEMINI_API_KEY")
os.environ["GEMINI_API_KEY"] = api_key

memory = InMemorySaver()

llm = init_chat_model("google_genai:gemini-2.0-flash")

fire_tool = FireDangerTool("")
tools = [fire_tool]

tool_node = BasicToolNode(tools=tools)

graph_builder = StateGraph(MessagesState)

graph = graph_builder.compile(checkpointer=memory)

graph_builder.add_node("tools", tool_node)

llm_with_tools = llm.bind_tools(tools)

def chatbot(state: MessagesState):
    return {"messages": [llm_with_tools.invoke(state["messages"])]}

graph_builder.add_node("chatbot", chatbot)

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

while True:
    user_input = input("User: ")
    if user_input.lower() in ["quit", "exit", "q"]:
        print("Goodbye")
        break
    stream_graph_updates(user_input)