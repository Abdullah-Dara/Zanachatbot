@echo on
echo ==============================================
echo Activating Conda environment...
echo ==============================================

REM Activate Anaconda
call "C:\ProgramData\Anaconda3\Scripts\activate.bat"

timeout /t 2 >nul

REM Activate chatbot environment
call conda activate ollama-chatbot

timeout /t 2 >nul

echo ==============================================
echo Starting chatbot server...
echo ==============================================

REM Run the Flask server
python server.py

echo ==============================================
echo Chatbot is now running on http://127.0.0.1:5000/chat
echo Press CTRL + C to stop the server.
echo ==============================================

pause
