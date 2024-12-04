import axios from "axios";

// Writing mode functions remain unchanged
export const handleWritingClick = async (setMessages, setIsLoading, setChatMode) => {
  setIsLoading(true);
  try {
    console.log("Starting writing mode...");
    const response = await axios.get("http://127.0.0.1:5000/api/start_writing");
    console.log("Received topic:", response.data);
    const botMessage = { text: response.data.topic, sender: "bot" };
    setMessages([botMessage]);
    setChatMode("writing");
  } catch (error) {
    console.error("Error fetching bot response:", error);
    const errorMessage = { text: "Sorry, there was an error processing your request.", sender: "bot" };
    setMessages([errorMessage]);
  } finally {
    setIsLoading(false);
  }
};

export const handleSendMessage = async (input, setInput, setMessages, setIsLoading, chatMode) => {
  if (!input.trim()) return;

  const userMessage = { text: input, sender: "user" };
  setMessages((prevMessages) => [...prevMessages, userMessage]);
  const currentInput = input;
  setInput("");

  setIsLoading(true);
  try {
    console.log("Sending paragraph:", currentInput);
    const response = await axios.post("http://127.0.0.1:5000/api/get_feedback_on_writing", {
      paragraph: currentInput,
    });
    console.log("Received feedback:", response.data);
    const botMessage = { text: response.data.feedback, sender: "bot" };
    setMessages((prevMessages) => [...prevMessages, botMessage]);
  } catch (error) {
    console.error("Error fetching bot response:", error);
    const errorMessage = { text: "Sorry, there was an error processing your request.", sender: "bot" };
    setMessages((prevMessages) => [...prevMessages, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};

// Updated Reading mode functions
export const handleReadingClick1 = async (setMessages, setIsLoading, setChatMode, setReadingInput, setAnswers) => {
  setIsLoading(true);
  try {
    console.log("Starting reading mode...");
    const response = await axios.get("http://127.0.0.1:5000/api/start_reading");
    console.log("Received reading data:", response.data);
    const { paragraph, questions } = response.data;

    // Store questions in state for later use
    setAnswers({ questions, currentQuestionIndex: 0, answers: [] });

    // Display only the paragraph and first question
    setMessages([
      { text: paragraph, sender: "bot" },
      { text: questions[0], sender: "bot" }
    ]);
    
    setChatMode("reading");
  } catch (error) {
    console.error("Error fetching reading mode data:", error);
    const errorMessage = { text: "Sorry, there was an error processing your request.", sender: "bot" };
    setMessages([errorMessage]);
  } finally {
    setIsLoading(false);
  }
};

// New function to handle sending answers in reading mode
export const handleReadingAnswer = async (input, setInput, setMessages, setIsLoading, answers, setAnswers) => {
  if (!input.trim()) return;

  const userMessage = { text: input, sender: "user" };
  setMessages((prevMessages) => [...prevMessages, userMessage]);
  setInput("");

  const { questions, currentQuestionIndex, answers: previousAnswers } = answers;
  const newAnswers = [...previousAnswers, input];

  // Check if there are more questions
  if (currentQuestionIndex + 1 < questions.length) {
    // Display next question
    const nextQuestion = { text: questions[currentQuestionIndex + 1], sender: "bot" };
    setMessages((prevMessages) => [...prevMessages, nextQuestion]);
    
    // Update answers state with new answer and increment question index
    setAnswers({
      questions,
      currentQuestionIndex: currentQuestionIndex + 1,
      answers: newAnswers
    });
  } else {
    // All questions have been answered
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: "Oh no, you got everything incorrect! Your score is 0.", sender: "bot" }
    ]);
    console.log("All answers:", newAnswers);
  }
};