# import libraries
from flask import Flask, request, jsonify
from llama_index.llms.ollama import Ollama
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import (Settings, Document)
import faiss
import numpy as np
import re
from flask_cors import CORS

# initiate Flask app
app = Flask(__name__)

# enable CORS
CORS(app)

# config - coding bot
Settings.llm = Ollama(model="qwen2.5-coder:1.5b", base_url='http://localhost:11434', temperature=0.0, request_timeout=300)
Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

docs = []
with open("data/coding_merged_doc.txt", 'r', encoding="UTF-8") as file:
    text = file.read()
docs.append(Document(text=text))

def create_faiss_index(docs):
    embed_model = Settings.embed_model
    embeddings = np.array([embed_model._embed(doc.text) for doc in docs])
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)
    return index, embeddings

faiss_index, doc_embeddings = create_faiss_index(docs)

def generate_answer(user_question, user_annotation):
    prompt_str = """
        You are a coding assistant who can answer questions related to Python, Java, and C only.

        Here is some context related to the query:
        -----------------------------------------
        {context_str}
        -----------------------------------------
        Considering the above information, please respond to the following inquiry.
        Question: {query_str}

        Annotation: {annotation}
        If the annotation is "describe", you have to give the answer as a description.
        If the annotation is "steps", you have to give the answer step by step.
        
        
    """
    embed_model = Settings.embed_model
    question_embedding = embed_model._embed(user_question)
    D, I = faiss_index.search(np.array([question_embedding]), k=1)
    top_docs = [docs[i] for i in I[0]]
    context_str = " ".join([doc.text for doc in top_docs])
    full_prompt = prompt_str.format(context_str=context_str, query_str=user_question, annotation=user_annotation)
    
    # Get the LLM's response
    completion_response = Settings.llm.complete(full_prompt)
    
    # Extract text from the CompletionResponse object
    if hasattr(completion_response, 'text'):
        response_text = completion_response.text
    elif hasattr(completion_response, 'content'):
        response_text = completion_response.content
    else:
        raise ValueError("Unexpected response format from LLM.")
    
    # Split text and code
    code_snippets = re.findall(r"```.*?```", response_text, re.DOTALL)  # Find multi-line code blocks
    plain_text = re.sub(r"```.*?```", "", response_text, flags=re.DOTALL).strip()  # Remove code blocks from text

    return {
        "text": plain_text,
        "code_snippets": [snippet.strip('`') for snippet in code_snippets]
    }
  
# API endpoint - coding bot
@app.route('/api/start_coding', methods=['POST'])
def start_coding():
    data = request.json
    if not data or "question" not in data or "annotation" not in data :
        return jsonify({"error": "Please provide required fields."}), 400
    
    user_question = data["question"]
    user_annotation = data["annotation"]

    try:
        allowed_languages = ["java", "c", "c++"]
        if not any(re.search(rf"\b{re.escape(lang)}\b", user_question.lower()) for lang in allowed_languages):
            return jsonify({"error": "I'm trained only for java, c and c++"}), 200
        answer = generate_answer(user_question, user_annotation)
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API endpoint - verify step
@app.route('/api/verify_step_coding', methods=['POST'])
def verify_step_coding():
    data = request.json
    if not data or "user_answer" not in data:
        return jsonify({"error": "Please provide required fields."}), 400
    
    user_answer = data["user_answer"]
    
    # step_conversation = [{'role': 'system', 'content': step_prompt}]
    # step_conversation.append({'role': 'user', 'content': user_answer})
    
    # try:
    #     step_response = ollama.chat(model='phi3:latest', messages=step_conversation)
    #     step_feedback = step_response['message']['content']
    #     return jsonify({"feedback": step_feedback})
    # except Exception as e:
    #     return jsonify({"error": str(e)}), 500

    return jsonify({"feedback": "Let's move."})

# run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
