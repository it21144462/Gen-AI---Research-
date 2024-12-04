import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { 
  handleWritingClick, 
  handleSendMessage, 
  handleReadingClick1,
  handleReadingAnswer 
} from "../../services/chatFunctions";

export default function EnglishChatPage({ title = "English Bot" }) {
  const [messages, setMessages] = useState([]);
  const [writingInput, setWritingInput] = useState("");
  const [readingInput, setReadingInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState(null);
  const [answers, setAnswers] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages]);

  const handleSend = () => {
    if (chatMode === "writing") {
      handleSendMessage(writingInput, setWritingInput, setMessages, setIsLoading, chatMode);
    } else if (chatMode === "reading") {
      handleReadingAnswer(readingInput, setReadingInput, setMessages, setIsLoading, answers, setAnswers);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#1a1a1a] to-[#132721] p-4">
      <div className="flex items-center justify-between text-white px-4 py-3">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Link to="/" className="text-emerald-400 hover:text-emerald-500">Back</Link>
      </div>
      
      {chatMode === null ? (
        <div className="flex flex-grow justify-center items-center text-white space-x-4">
          <button 
            onClick={() => handleWritingClick(setMessages, setIsLoading, setChatMode)}
            className="px-6 py-3 bg-emerald-600 rounded-lg text-xl font-bold">
            Writing
          </button>
          <button 
            onClick={() => handleReadingClick1(setMessages, setIsLoading, setChatMode, setReadingInput, setAnswers)}
            className="px-6 py-3 bg-emerald-600 rounded-lg text-xl font-bold">
            Reading
          </button>
        </div>
      ) : (
        <>
          <div className="flex-grow flex flex-col overflow-auto p-4" ref={chatContainerRef}>
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-3`}>
                <div className={`max-w-xs p-3 rounded-lg ${message.sender === "user" ? "bg-emerald-600 text-white" : "bg-gray-800 text-white"}`}>
                  {message.text}
                </div>
              </div>
            ))}
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
          
          <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-xl relative">
              <input
                type="text"
                placeholder={chatMode === "writing" ? `Ask ${title} anything...` : "Answer the question..."}
                className="w-full p-4 pr-12 rounded-lg bg-[#2a2b32] text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-emerald-500"
                value={chatMode === "writing" ? writingInput : readingInput}
                onChange={(e) => chatMode === "writing" ? setWritingInput(e.target.value) : setReadingInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 rounded-lg">
                <img src="/send.svg" alt="Send" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}