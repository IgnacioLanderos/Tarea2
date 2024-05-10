import React, { useState } from 'react';

const Chat = ({ messages, sendMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div style={{ maxHeight: '300px', overflowY: 'scroll', padding: '10px', border: '1px solid #ccc' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <p style={{ margin: '0' }}>
              <strong>{message.sender || 'Anónimo'}</strong>: {message.message} {/* Aquí se muestra el contenido del mensaje */}
            </p>
            <span style={{ fontSize: '0.8em', color: 'gray' }}>{message.timestamp}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe tu mensaje..."
          style={{ width: '80%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        <button onClick={handleSendMessage} style={{ padding: '10px', marginLeft: '10px' }}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chat;
