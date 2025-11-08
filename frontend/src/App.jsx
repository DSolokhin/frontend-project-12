import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import ChatPage from './components/ChatPage'
import NotFoundPage from './components/NotFoundPage'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
