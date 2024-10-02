// src/App.jsx
import React from 'react';
import Chatbot from './Chatbot';
import './index.css'; // Make sure to import the Tailwind CSS

function App() {
  return (
    <div className="h-screen flex justify-center items-center bg-black">
      <div className="w-full rounded-lg shadow-lg overflow-hidden">
        <Chatbot />
      </div>
    </div>
  );
}

export default App;
