import React, { useState, useRef, useEffect } from "react";
import ChatService from "../services/ChatService";
import "./FloatingChatbot.scss";

// Helper to convert URLs in text to clickable links
function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
  );
}

function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(true);
  const [position, setPosition] = useState({ top: 100, left: 100 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const botRef = useRef(null);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "minda",
      text: "Hello! I'm Minda, your mental wellness companion. How can I help you today?",
    },
  ]);

  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const onMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    const rect = botRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onMouseMove = (e) => {
    if (!dragging) return;
    let newLeft = e.clientX - dragOffset.current.x;
    let newTop = e.clientY - dragOffset.current.y;

    newLeft = Math.max(0, newLeft);
    newTop = Math.max(0, newTop);

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const botRect = botRef.current.getBoundingClientRect();
    const maxLeft = vw - botRect.width;
    const maxTop = vh - botRect.height;

    newLeft = Math.min(newLeft, maxLeft);
    newTop = Math.min(newTop, maxTop);

    setPosition({ left: newLeft, top: newTop });
  };

  const onMouseUp = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const reply = await ChatService.sendMessage(input);
      const mindaMessage = { sender: "minda", text: reply };
      setMessages((prev) => [...prev, mindaMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "minda",
          text: "Sorry, something went wrong. Please try again later.",
        },
      ]);
    }
  };

  const onInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      ref={botRef}
      className={`floating-chatbot ${isOpen ? "open" : "minimized"}`}
      style={{
        top: position.top,
        left: position.left,
        position: "fixed",
        pointerEvents: "auto",
      }}
    >
      {isOpen ? (
        <div className="chat-window">
          <div
            className="chat-header"
            onMouseDown={onMouseDown}
            style={{ cursor: "grab" }}
          >
            <h4>Minda (AI)</h4>
            <button onClick={toggleChat}>_</button>
          </div>

          <div className="chat-body" ref={chatBodyRef}>
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
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onInputKeyDown}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      ) : (
        <button
          className="minimized-button"
          onClick={toggleChat}
          onMouseDown={onMouseDown}
          style={{ cursor: "grab" }}
        >
          Minda
        </button>
      )}
    </div>
  );
}

export default FloatingChatbot;
