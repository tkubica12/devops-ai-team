import React, { useState, useEffect } from 'react';
import './App.css';
import Message from './Message';
import { v4 as uuidv4 } from 'uuid';
import { FaSync } from 'react-icons/fa'; // Import FontAwesome sync icon

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (conversationId) {
        fetchMessages();
      }
    }, 1000); // Fetch messages every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [conversationId]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/conversations');
      const data = await response.json();
      setConversations(data);
      if (data.length > 0) {
        setConversationId(data[0]); // Automatically select the top conversation
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/messages?conversation_id=${conversationId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleInputSubmit = async (e) => {
    if (e.key === 'Enter' && inputMessage.trim()) {
      let newConversationId = conversationId;
      if (!conversationId) {
        newConversationId = uuidv4();
        setConversationId(newConversationId);
        setConversations((prevConversations) => [...prevConversations, newConversationId]);
      }

      const newMessage = {
        message: inputMessage,
        conversation_id: newConversationId,
      };

      try {
        const response = await fetch('http://localhost:8000/api/user_message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMessage),
        });

        if (response.ok) {
          const data = await response.json();
          setMessages((prevMessages) => [...prevMessages, data]);
          setInputMessage('');
        } else {
          console.error('Error posting message:', response.statusText);
        }
      } catch (error) {
        console.error('Error posting message:', error);
      }
    }
  };

  const handleConversationChange = (e) => {
    setConversationId(e.target.value);
  };

  return (
    <div className="App">
      <div className="header">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="logo" />
        <h1>AI team discussion</h1>
      </div>
      <div className="input-section">
        <img src={`${process.env.PUBLIC_URL}/user.png`} alt="User Icon" className="user-icon" />
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={handleInputSubmit}
          placeholder="Type your message and hit Enter..."
        />
        <div className="conversation-selector">
          <select onChange={handleConversationChange} value={conversationId || ''}>
            <option value="" disabled>Select a conversation</option>
            {conversations.map((convId) => (
              <option key={convId} value={convId}>
                {convId}
              </option>
            ))}
          </select>
          <FaSync className="refresh-icon" onClick={fetchConversations} title="Refresh Conversations" />
        </div>
      </div>
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
      </div>
    </div>
  );
}

export default App;