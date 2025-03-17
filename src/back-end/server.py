from flask import Flask, request, jsonify
import requests
from deep_translator import GoogleTranslator

app = Flask(__name__)

OLLAMA_URL = "http://localhost:11434/api/chat"  # Ensure Ollama is running

def detect_language(text):
    """
    Use the unofficial Google Translate API endpoint to detect language.
    Returns a language code (e.g., 'en', 'ckb', etc.). Defaults to 'en' if detection fails.
    """
    url = "https://translate.googleapis.com/translate_a/single"
    params = {
        "client": "gtx",
        "sl": "auto",
        "tl": "en",
        "dt": "t",
        "q": text,
    }
    try:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            result = response.json()
            # The detected language code is in the third element of the outer array.
            detected = result[2]
            return detected
        else:
            return "en"
    except Exception as e:
        print("Error detecting language:", e)
        return "en"

@app.route('/')
def home():
    return "Welcome to the Chatbot API. Use /chat to interact with the chatbot."

@app.route('/favicon.ico')
def favicon():
    return '', 204  # Return empty response with HTTP 204 (No Content)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get("prompt", "")

    # Detect the language using our helper function.
    detected_lang = detect_language(user_message)
    print("Detected language:", detected_lang)
    
    # If the detected language is not English, translate the prompt into English.
    if detected_lang != "en":
        try:
            translated_prompt = GoogleTranslator(source=detected_lang, target="en").translate(user_message)
            print("Translated prompt from", detected_lang, "to English:", translated_prompt)
        except Exception as e:
            print("Translation error for prompt:", e)
            translated_prompt = user_message
    else:
        translated_prompt = user_message

    # Prepend your prompt-engineering instructions.
    instructions = (
        "Your expertise is exclusively in tangible and intangible cultural heritage (CH) artifacts "
        "in the Kurdistan region of Iraq. When a user asks a question about these topics, provide a detailed answer. "
        "However, if the user asks about any other subject, respond only with: "
        "'I only have information about Cultural Heritage artifacts in Kurdistan region of Iraq.' "
    )
    engineered_prompt = instructions + translated_prompt

    payload = {
        "model": "llama3.2:3b",
        "messages": [
            {"role": "user", "content": engineered_prompt}
        ],
        "stream": False
    }

    try:
        # Send the engineered prompt to the Ollama API.
        response = requests.post(OLLAMA_URL, json=payload)
        result = response.json()
        print("Ollama API response:", result)
        generated_text = result.get("message", {}).get("content", "No response provided")

        # If the detected language is not English, translate the response from English back to the detected language.
        if detected_lang != "en":
            try:
                translated_response = GoogleTranslator(source="en", target=detected_lang).translate(generated_text)
                print("Translated response from English to", detected_lang, ":", translated_response)
                generated_text = translated_response
            except Exception as e:
                print("Translation error for response:", e)

        return jsonify(response=generated_text)
    except Exception as e:
        print("Error in chat endpoint:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
