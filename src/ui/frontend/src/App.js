import React, { useState, useEffect } from 'react';
import './App.css';
import Message from './Message';
import { FaSync, FaPlus, FaPaperPlane } from 'react-icons/fa'; // Import FaPlus icon

const adjectives = [
  'green', 'blue', 'red', 'yellow', 'happy', 'sad', 'fast', 'slow',
  'bright', 'dark', 'cheerful', 'gloomy', 'quick', 'lazy', 'brave', 'timid',
  'strong', 'weak', 'smart', 'dull', 'friendly', 'hostile', 'calm', 'angry'
];

const nouns = [
  'Dog', 'Cat', 'Bird', 'Fish', 'Lion', 'Tiger', 'Bear', 'Shark',
  'Elephant', 'Wolf', 'Fox', 'Rabbit', 'Deer', 'Horse', 'Monkey', 'Giraffe',
  'Panda', 'Koala', 'Kangaroo', 'Leopard', 'Zebra', 'Cheetah', 'Hawk', 'Eagle'
];

function generateCodename() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective}${noun}`;
}

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [newConversationId, setNewConversationId] = useState('');

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
      const response = await fetch('/api/conversations');
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
      const response = await fetch(`/api/messages?conversation_id=${conversationId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!conversationId) {
      alert('Please create or select a conversation before sending a message.');
      return;
    }
  
    if (inputMessage.trim()) {
      const newMessage = {
        message: inputMessage,
        conversation_id: conversationId,
      };
  
      try {
        const response = await fetch('/api/user_message', {
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

  const handleCreateNewConversation = () => {
    const newId = prompt('Enter new conversation ID:', generateCodename());
    if (newId) {
      setConversationId(newId);
      setConversations((prevConversations) => [...prevConversations, newId]);
    }
  };

  const handleConversationChange = (e) => {
    setConversationId(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
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
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <FaPaperPlane className="send-icon" onClick={handleSendMessage} title="Send Message" />
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
          <FaPlus className="new-conversation-icon" onClick={handleCreateNewConversation} title="New Conversation" />
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