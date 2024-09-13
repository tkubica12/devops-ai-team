import React, { useState, useEffect } from 'react';
import './App.css';
import Message from './Message';

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/messages?conversation_id=dec4dc08-7d25-4c9a-835d-2e6e47540b17');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="App">
      <h1>AI team discussion</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
      </div>
    </div>
  );
}

export default App;