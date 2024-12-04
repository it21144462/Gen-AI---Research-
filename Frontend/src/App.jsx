import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Welcome from './pages/Welcome'
import Sidebar from './components/layout/Sidebar'
import WelcomeScreen from './pages/WelcomeScreen'
import EnglishChatPage from './pages/bot_pages/EnglishBotPage'
import MathChatPage from './pages/bot_pages/MathBotPage'
import CodeChatPage from './pages/bot_pages/CodeBotPage'

export default function App() {
  return (
    <Router>
      <Routes>
      {/* <Route path="/" element={<WelcomeScreen />} />
        <Route path="/home" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes> */}
      <Route path="/" element={<Welcome />} />
        {/* <Route path="/chat/:botType" element={<EnglishChatPage />} /> */}
        <Route path="/chat/english" element={<EnglishChatPage />} />
        <Route path="/chat/math" element={<MathChatPage />} />
        <Route path="/chat/code" element={<CodeChatPage />} />
      </Routes>
    </Router>

  )
}