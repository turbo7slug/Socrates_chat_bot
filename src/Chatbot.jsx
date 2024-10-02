// src/Chatbot.jsx
import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai"; 

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const socraticContext = 
  "You are a teaching assistant that uses the Socratic method to teach. " +
  "Instead of providing direct answers, you should ask probing questions that lead the student to discover the answers themselves. " +
  "Always consider the context of the ongoing conversation and tailor your questions based on the student's responses.";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = async () => {
    if (!userInput) return;

    const userMessage = {
      sender: 'user',
      message: userInput,
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    const fullInput = `${socraticContext}\n\nUser: ${userInput}\nAI:`;

    try {
      const result = await model.generateContent(fullInput);
      const aiMessage = {
        sender: 'ai',
        message: result.response.text(),
        timestamp: new Date().toLocaleString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setUserInput('');
    }
  };

  // Handle pressing Enter key to send message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900  text-white">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-xlg ${msg.sender === 'user' ? 'bg-blue-600 self-end' : 'bg-gray-800 self-start'}`}
            >
              <strong className="text-sm">{msg.sender === 'user' ? 'You' : 'AI'}</strong>
              <p>{msg.message}</p>
              <span className="text-xs text-gray-400">{msg.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-gray-700 flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your question here..."
        />
        <button
          onClick={handleSendMessage}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
