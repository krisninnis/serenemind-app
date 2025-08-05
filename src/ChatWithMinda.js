import React, { useState, useRef, useEffect } from "react";
import ChatService from "./services/ChatService";
import "./App.scss";

// Helper to convert URLs in text to clickable links
function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
  );
}

function ChatWithMinda() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "minda",
      text: "Hello, I'm Minda – your mental wellness companion 💬. What's on your mind today?",
    },
  ]);

  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const reply = await ChatService.sendMessage(input);
      const botMessage = { sender: "minda", text: reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "minda",
          text: "Sorry, something went wrong. Try again later.",
        },
      ]);
    }
  };

  return (
    <div className="App-header">
      <div className="chatbot-header">
        <img
          src="/serene-mind-logo.png"
          alt="SereneMind Logo"
          className="logo"
        />

        <h1>Chat with Minda</h1>
        <p className="minda-subtitle">
          Your mindful mental wellness assistant 🌿
        </p>
      </div>

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.sender}`}
            dangerouslySetInnerHTML={{ __html: linkify(msg.text) }}
          />
        ))}
      </div>

      <div className="chat-input-group">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type something..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatWithMinda;
