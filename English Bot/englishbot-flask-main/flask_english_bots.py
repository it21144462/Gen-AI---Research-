# import libraries
from flask import Flask, request, jsonify
import ollama
import ast
from gtts import gTTS
from flask_cors import CORS

# initiate Flask app
app = Flask(__name__)

CORS(app)

# set system prompt - writing
system_prompt_writing = """
    You're a good English tutor.
    Generate a topic for a student to write a paragraph.

    Output only the topic.

    Example:

    "The value of trees"
    
    Do not output anything other than the topic, no explanation needed.
    """

# set feedback prompt - writing
feedback_prompt_writing = """
    You're a good English tutor who can analyze a paragraph written in English and give a summary about it.
    You will be given a paragraph written by a student.
    Your tasks are: 
        to check the grammar of it and show the grammar errors.
        suggest alternative sentences.
    
    Scope Limitation:
        Do not output anything beyond the specified response.
    """

# set system prompt - reading/listening
system_prompt_reading_listening = """
    Generate a medium-sized paragraph about something.
    Generate two questions about the paragraph and single-word answers for them.

    Output only a dictionary containing three key-value pairs.
        Store the paragraph as a string.
        Store the two questions as a list.
        Store the two answers as a list.

    Expected output structure:
    {"paragraph": "", "questions": ["", ""], "answers": ["", ""]}

    Example:
    {"paragraph": "The Eiffel Tower is a wrought-iron lattice tower located on the Champ de Mars in Paris, France. Named after its engineer, Gustave Eiffel, it was constructed for the Exposition Universelle (World'suitability) of 1889 to celebrate the 100th anniversary of the French Revolution and is now one of the most recognizable structures in the world.", "questions": ["Was Gustave Eiffel an engineer?", "Where the Eiffel Tower is located?"], "answers": ["Yes", "Paris"]}
    
    Do not output anything than the dictionary, no explanation needed.
    """
# set system prompt - reading/listening
step_prompt_reading_listening = """
    You will be given a correct answer and the user's answer.
    You have to compare the user's answer with the correct answer and output like below. Thoroughly consider the following instructions. 

        If it is matching, output in one word as "Correct".

        If it is not matching, output in one word as "Wrong".
    
    Example 1:-
    user: user answer = "yes", correct answer = "yes"
    "Correct"
    
    Example 2:-
    user: user answer = "no", correct answer = "yes"
    "Wrong"

    Scope Limitation:
        Do not output anything other than what you're instructed.
"""

# API endpoint - reading bot
@app.route('/api/start_writing', methods=['GET'])
def start_writing():
    conversation = [{'role': 'system', 'content': system_prompt_writing}]

    try:
        response = ollama.chat(model='phi3:latest', messages=conversation)
        topic = response['message']['content']
        return jsonify({"topic": topic})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API endpoint - reading bot
@app.route('/api/start_reading', methods=['GET'])
def start_reading():
    conversation = [{'role': 'system', 'content': system_prompt_reading_listening}]
    
    try:
        response = ollama.chat(model='phi3:latest', messages=conversation)
        extracted = response['message']['content']
        result = ast.literal_eval(extracted)
        return jsonify({"paragraph": result["paragraph"], "questions": result["questions"], "answers": result["answers"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API endpoint - listening bot
@app.route('/api/start_listening', methods=['GET'])
def start_listening():
    conversation = [{'role': 'system', 'content': system_prompt_reading_listening}]
    
    try:
        response = ollama.chat(model='phi3:latest', messages=conversation)
        extracted = response['message']['content']
        result = ast.literal_eval(extracted)
        paragraph = result["paragraph"]
        speech_paragraph = gTTS(text=paragraph, lang='en')
        speech_paragraph.save("paragraph.mp3")
        return jsonify({"audio_path": "paragraph.mp3", "questions": result["questions"], "answers": result["answers"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
   
# API endpoint - feedback - writing
@app.route('/api/get_feedback_on_writing', methods=['POST'])
def get_feedback_on_writing():
    data = request.json
    if not data or "paragraph" not in data:
        return jsonify({"error": "Please provide 'paragraph' field."}), 400
    
    user_paragraph = data["paragraph"]

    feedback_conversation = [{'role': 'system', 'content': feedback_prompt_writing}]
    feedback_conversation.append({'role': 'user', 'content': user_paragraph})
    
    try:
        feedback_response = ollama.chat(model='phi3:latest', messages=feedback_conversation)
        feedback = feedback_response['message']['content']
        return jsonify({"feedback": feedback})
    except Exception as e:
        return jsonify({"error": str(e)}), 500    

# API endpoint - verify step - reading/listening
@app.route('/api/verify_step_reading_listening', methods=['POST'])
def verify_step_reading_listening():
    data = request.json
    if not data or "user_answer" not in data or "correct_answer" not in data:
        return jsonify({"error": "Please provide 'user_answer' and 'correct_answer' fields."}), 400
    
    user_answer = data["user_answer"]
    correct_answer = data["correct_answer"]
    
    step_conversation = [{'role': 'system', 'content': step_prompt_reading_listening}]
    step_user_final_input = f"user answer = {user_answer}, correct answer = {correct_answer}"
    step_conversation.append({'role': 'user', 'content': step_user_final_input})
    
    try:
        step_response = ollama.chat(model='phi3:latest', messages=step_conversation)
        step_feedback = (step_response['message']['content']).split(' ')[0]
        return jsonify({"feedback": step_feedback})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
