# Zana Chatbot

**Zana** is an intelligent chatbot designed to provide detailed information about cultural heritage (CH) artifacts in the Kurdistan region of Iraq. It uses advanced language models, prompt engineering, and automatic language detection/translation to offer domain-specific responses in the user's language.

## Features

- **Domain-Specific Responses:**  
  Answers only questions about tangible and intangible CH artifacts in Kurdistan.
- **Modern User Interface:**  
  Built with React for a responsive and engaging chat experience.
- **Robust Backend:**  
  Powered by a Flask server that connects to an Ollama-hosted `llama3.2:3B` model.

## Prerequisites

Before running the project, ensure you have the following installed:

- **Git** – [Download Git](https://git-scm.com/downloads)
- **Node.js and npm** (or [Yarn](https://yarnpkg.com/)) – [Download Node.js](https://nodejs.org/en/download/)
- **Anaconda/Miniconda** – [Download Anaconda](https://www.anaconda.com/products/distribution)
- **Python 3.8+**
- **Ollama** – [Download Ollama](https://ollama.com/) (Ensure Ollama is installed and running)
- **Llama Model `llama3.2:3B`** – Download and configure this model in Ollama following its documentation.

1. Setting Up the Python Backend
a. Create and Activate the Conda Environment
Open Anaconda Prompt and run:
conda create -n ollama-chatbot python=3.8
conda activate ollama-chatbot

b. Install Python Dependencies
Within the activated environment, install the required packages:
pip install flask requests deep-translator langid

c. Configure Ollama and Llama Model
Ensure Ollama is installed and running.
Download and configure the llama3.2:3B model in Ollama according to its documentation.
Verify that the model is accessible at <http://localhost:11434/api/chat>.

d. Run the Backend Server (this might not work so run it from the command prompt)
Use the provided batch file to launch the server. In the backend folder, double-click start_chatbot.bat or run it from the command prompt. This file will activate the conda environment and start the Flask server.

2. Setting Up the React Frontend
Navigate to the frontend folder, then install dependencies:
npm install

After installing, start the development server:
npm start

3. Running the Chatbot
Start the Backend:
Run the batch file (start_chatbot.bat) to activate the Anaconda environment and start the Flask server on port 5000.

Start the Frontend:
In the frontend folder, run npm start (or yarn start) to launch the React interface.

Interact with Zana:
Ask questions about tangible and intangible CH artifacts in Kurdistan. The chatbot will automatically detect the input language, translate if necessary, and respond accordingly.

4. Troubleshooting

Translation Issues:
Ensure your internet connection is active, as translation relies on external APIs.

Ollama Model:
Verify that Ollama is running and the llama3.2:3B model is configured correctly.

Environment Issues:
Always activate the correct conda environment (ollama-chatbot) before running the backend.
