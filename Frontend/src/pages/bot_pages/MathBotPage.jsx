import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function EnglishChatPage({ title = "Math Bot" }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false); // State to track if chat has started
  const chatContainerRef = useRef(null);

  const handleStartChat = async () => {
    // Send a request to the server to get the initial bot response
    setIsLoading(true);
    try {
      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Start" }), // Just a placeholder message to get the initial response
      });
      const data = await response.json();

      // Add bot response as the first message
      const botMessage = { text: data.topic, sender: "bot" };
      setMessages([botMessage]);

      setIsLoading(false);
      setIsStarted(true); // Mark the chat as started
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      // Add user's message to chat
      const newMessage = { text: input, sender: "user" };
      setMessages([...messages, newMessage]);

      // Set loading to true
      setIsLoading(true);

      // Send the message to the backend
      try {
        const response = await fetch("http://localhost:3001/api/start_writing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }),
        });
        const data = await response.json();

        // Bot response
        const botMessage = { text: data.topic, sender: "bot" };
        setMessages((prevMessages) => [...prevMessages, botMessage]);

        // Set loading to false after response
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching bot response:", error);
        setIsLoading(false); // Set loading to false in case of error
      }
    }
    setInput("");  // Clear the input after sending
  };

  // Scroll to bottom when new message is added
  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#1a1a1a] to-[#132721] p-4">
      {/* Header */}
      <div className="flex items-center justify-between text-white px-4 py-3">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Link to="/" className="text-emerald-400 hover:text-emerald-500">
          Back
        </Link>
      </div>

      {/* If chat has not started, show start button */}
      {!isStarted ? (
        <div className="flex flex-grow justify-center items-center text-white">
          <button
            onClick={handleStartChat}
            className="px-6 py-3 bg-emerald-600 rounded-lg text-xl font-bold"
          >
            Start Chat
          </button>
        </div>
      ) : (
        <div className="flex-grow flex flex-col overflow-auto p-4" ref={chatContainerRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } mb-3`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-800 text-white"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}

          {/* Display loading indicator while waiting for bot response */}
          {isLoading && (
            <div className="flex justify-start mb-3">
              <div className="max-w-xs p-3 rounded-lg bg-gray-800 text-white">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-white animate-pulse mr-2" />
                  <div>Typing...</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Field */}
      {isStarted && (
        <div className="flex items-center justify-center p-4">
          <div className="w-full max-w-xl relative">
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
            >
              <img src="/send.svg" alt="Send" className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}