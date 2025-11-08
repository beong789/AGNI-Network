import os
from langgraph.graph import StateGraph, MessagesState, START, END
from .tools import fire_danger
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolNode
from langchain_google_genai import ChatGoogleGenerativeAI

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable is not set!")

memory = MemorySaver()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash-exp",
    google_api_key=api_key
)

system_prompt = {
    "role": "system",
    "content": (
        "You are AGNI, an intelligent assistant specialized in analyzing and predicting fire risks. "
        "Your goal is to help users understand current fire danger levels, provide guidance, "
        "and answer questions related to fire safety and risk factors. "
        "Always maintain a professional and helpful tone. "
        "Never mention Gemini or that you are a language model."
    )
}

tools = [fire_danger]
tool_node = ToolNode(tools=tools)

graph_builder = StateGraph(MessagesState)

llm_with_tools = llm.bind_tools(tools)

def chatbot(state: MessagesState):
    messages = state.get("messages", [])
    prompt = [system_prompt] + messages
    return {"messages": [llm_with_tools.invoke(prompt)]}

graph_builder.add_node("chatbot", chatbot)
graph_builder.add_node("tools", tool_node)

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

graph = graph_builder.compile(checkpointer=memory)