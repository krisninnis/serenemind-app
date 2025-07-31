import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.scss";

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
      // Use relative URL here since proxy handles forwarding to backend
      const response = await axios.post("/chat", { message: input });
      const reply = response.data.reply || "I'm here to support you.";
      const botMessage = { sender: "minda", text: reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
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
        <h1>Chat with Minda</h1>
        <p className="minda-subtitle">
          Your mindful mental wellness assistant 🌿
        </p>
      </div>

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
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
