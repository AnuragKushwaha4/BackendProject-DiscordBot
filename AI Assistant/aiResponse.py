from flask import Flask,request,jsonify
from dotenv import load_dotenv
import os
load_dotenv()

os.environ["LANGCHAIN_API_KEY"]=os.getenv("LANGCHAIN_API_KEY")
os.environ["GROQ_API_KEY"]=os.getenv("GROQ_API_KEY")
os.environ["LANGCHAIN_PROJECT"]=os.getenv("LANGCHAIN_PROJECT")
os.environ["LANGCHAIN_TRACING_V2"]="true"
port = os.getenv("PORTAI")

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate,MessagesPlaceholder
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.output_parsers import StrOutputParser

HistoryContainer ={}
def getMessageHistory(session_id : str)->BaseChatMessageHistory:
    if session_id not in HistoryContainer.keys():
        HistoryContainer[session_id]=ChatMessageHistory()
    return HistoryContainer[session_id]



outputParser = StrOutputParser()
llm = ChatGroq(model="llama-3.3-70b-versatile")
prompt = ChatPromptTemplate.from_messages(
    [
    ("system","You are helpfull AI assistant bot help user in their query in easy to understand language and briefly."),
    (MessagesPlaceholder("chat_history")),
    ("user","{input}")
    ]
)

normalChain = prompt|llm|StrOutputParser()

chain_with_message_history = RunnableWithMessageHistory(
    normalChain,
    get_session_history=getMessageHistory,
    history_messages_key="chat_history",
    input_messages_key="input"
)





app = Flask(__name__)




@app.route("/ai_response", methods=["POST"])
def AIResponse():
    data = request.get_json()
    user_query = data.get("query")
    if not user_query:
        return jsonify({"response":"Ask me Question.."})
    
    try:
        config ={
        "configurable":{"session_id":"chat1"}
        }
        res = chain_with_message_history.invoke(
            {"input":user_query},
            config=config
        )
        res = chain_with_message_history.invoke({"input": user_query}, config=config)
        return jsonify({"response": res})


    except Exception as e:
        print("Error:", e)
        return jsonify({"response":"Result not found"})


if __name__ == "__main__":
    app.run(host='0.0.0.0',port=port)