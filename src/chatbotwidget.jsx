import React, { useState, useRef, useEffect } from 'react';
import './meow.css';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false); // Track whether the chat window is open.
  const [messages, setMessages] = useState([]); // Holds the conversation messages.
  const [input, setInput] = useState(''); // Holds the current text input.
  const [loading, setLoading] = useState(false); // True while waiting for a server response.
  const messagesEndRef = useRef(null); // Reference to the bottom of the messages list.

  // Toggle the chat window open/closed.
  const toggleChat = () => setIsOpen((prev) => !prev);

  // Auto-scroll to the bottom whenever messages update.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // handleSubmit function that calls the Flask server.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
  
    // Add the user's message to the UI.
    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
  
    // Store the current input for sending.
    const currentInput = input;
    setInput('');
    setLoading(true);
  
    // Create an engineered prompt that prepends your instructions.
    const instructions = "Your expertise is exclusively in tangible and intangible cultural heritage (CH) artifacts in the Kurdistan region of Iraq. When a user asks a question about these topics, provide a detailed answer using your knowledge. However, if the user asks about any other subject, respond only with: 'I only have information about Cultural Heritage artifacts in Kurdistan region of Iraq.' ";
    const engineeredPrompt = instructions + currentInput;
  
    try {
      // Fetch the response from your Flask server.
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: engineeredPrompt,
          history: [...messages, userMessage]
          // No language field is sent; the backend will detect the language automatically.
        })
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      const botResponse = { sender: 'bot', text: data.response };
  
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="chatbot-widget">
      {isOpen ? (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-avatar">
              {/* Chatbot's avatar */}
              <img src="/logo.png" alt="Zana Bot" />
            </div>
            <div className="chatbot-title">Zana</div>
            <button className="chatbot-close" onClick={toggleChat}>
              &times;
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="chat-loading">Loading...</div>}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input-area" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      ) : (
        <button className="chatbot-toggle-closed" onClick={toggleChat}>
          <img src="/logo.png" alt="Zana Logo" className="chatbot-logo" />
          <span className="chatbot-text">Chat with Zana</span>
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget;
