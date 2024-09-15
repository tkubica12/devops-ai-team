import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './Message.css';

function Message({ message }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`message ${expanded ? 'expanded' : ''}`}>
      <div className="message-header">
        <div className="avatar-container">
          <img
            src={`${process.env.PUBLIC_URL}/${message.event_producer}.png`}
            alt={message.event_producer}
            className="avatar"
          />
          <span className="agent-name">{message.event_producer}</span>
        </div>
        <span className="timestamp">{new Date(parseInt(message.timestamp) * 1000).toLocaleString()}</span>
      </div>
      <div className="message-content">
        <ReactMarkdown>
          {expanded ? message.message : `${message.message.substring(0, 100)}...`}
        </ReactMarkdown>
        <div className="toggle-button-container">
          <button className="toggle-button" onClick={toggleExpand}>
            {expanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
      </div>
      {/* <div className="next-agent">Next Agent: {message.next_agent}</div> */}
    </div>
  );
}

export default Message;