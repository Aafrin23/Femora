import { useState } from "react";
import "./femoraAi.css";

export default function FemoraAI({ isOpen, setIsOpen }) {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! I'm Femora AI ✨ How can I help you today?",
    },
  ]);

  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.error("Femora AI error:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, something went wrong. Please try again 💗",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="femora-ai-panel">

          {/* Header */}
          <div className="femora-ai-header">
            <div>
              <h3>Femora AI ✨</h3>
              <span>Your personal AI assistant</span>
            </div>

           <button
    className="close-ai"
    onClick={() => {
      setIsOpen(false);
      setMessages([
        {
          sender: "ai",
          text: "Hi! I'm Femora AI ✨ How can I help you today?",
        },
      ]);
      setMessage("");
    }}
  >
    ×
  </button>
          </div>

          {/* Messages */}
          <div className="femora-ai-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.sender === "user"
                    ? "user-message"
                    : "ai-message"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="message ai-message typing">
                Femora AI is thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <div className="femora-ai-input">
            <input
              type="text"
              placeholder="Ask Femora anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
            >
              ➤
            </button>
          </div>

        </div>
      )}
    </>
  );
}