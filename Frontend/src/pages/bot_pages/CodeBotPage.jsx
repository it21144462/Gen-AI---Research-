import React, { useState } from "react";
import axios from "axios";

export default function EnglishChatPage({ title = "Code Bot" }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentMode, setCurrentMode] = useState("Steps"); // Default mode
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { text: input, sender: "user", mode: currentMode }]);

    try {
      setLoading(true);
      setIsTyping(true);

      console.log(`Sending message: "${input}" with mode: "${currentMode}"`);
      const response = await axios.post("http://127.0.0.1:5000/api/start_coding", {
        question: input,
        annotation: currentMode,
      });

      console.log("API Response:", response.data);
      const { code_snippets, text } = response.data.answer;

      // Format the text
      const formattedText = formatTextResponse(text);

      // Add bot response
      setMessages((prev) => [
        ...prev,
        { text: formattedText, sender: "bot", isFormatted: true },
        ...code_snippets.map((code) => ({ text: code, sender: "bot", isCode: true })),
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "I can only answer questions related to Python, Java, and C only", sender: "bot" },
      ]);
    } finally {
      setIsTyping(false);
      setLoading(false);
      setInput(""); // Clear input field
    }
  };

  const formatTextResponse = (text) => {
    return text
      .split("\n\n")
      .map((section) => {
        if (section.startsWith("###")) {
          return `<h3 class="text-xl font-bold text-green-400">${section.replace("###", "").trim()}</h3>`;
        } else if (section.startsWith("-")) {
          return `<li class="ml-4">${section.replace("-", "").trim()}</li>`;
        } else {
          return `<p class="mb-2">${section.trim()}</p>`;
        }
      })
      .join("");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    console.log("Copied to clipboard:", text);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#1a1a1a] to-[#132721] p-4">
      {/* Header */}
      <div className="flex items-center justify-between text-white px-4 py-3">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      {/* Chat Area */}
      <div className="flex-grow flex flex-col overflow-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            } mb-3`}
          >
            <div
              className={`max-w-xl p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-800 text-white"
              }`}
            >
              {message.isCode ? (
                <div className="relative">
                  <pre className="overflow-auto p-3 bg-gray-900 rounded-lg">
                    <code className="text-green-400">{message.text}</code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard(message.text)}
                    className="absolute top-2 right-2 bg-emerald-600 text-white px-2 py-1 rounded text-sm hover:bg-emerald-700"
                  >
                    Copy
                  </button>
                </div>
              ) : message.isFormatted ? (
                <div
                  className="formatted-text"
                  dangerouslySetInnerHTML={{ __html: message.text }}
                ></div>
              ) : (
                message.text
              )}
            </div>
          </div>
        ))}

        {/* Typing Effect */}
        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="max-w-xl p-3 rounded-lg bg-gray-800 text-white">
              <span className="animate-pulse">Typing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-xl relative">
          {/* Mode Selector */}
          <div className="flex items-center mb-2">
            <label className="text-white mr-2">Mode:</label>
            <select
              className="p-2 rounded bg-gray-800 text-white"
              value={currentMode}
              onChange={(e) => setCurrentMode(e.target.value)}
            >
              <option value="Steps">Steps</option>
              <option value="Describe">Describe</option>
            </select>
          </div>

          {/* Input and Send Button */}
          <div className="relative">
            <input
              type="text"
              placeholder={`Ask ${title} anything...`}
              className="w-full p-4 pr-12 rounded-lg bg-[#2a2b32] text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-emerald-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={handleSendMessage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 rounded-lg"
              disabled={loading}
            >
              <img src="/send.svg" alt="Send" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
