import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const ChatPage = () => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="chat-page">
      <header className="chat-header">
        <h1>Hexlet Chat</h1>
        <div className="user-info">
          <span>Добро пожаловать, {user?.username}!</span>
          <button onClick={handleLogout} className="logout-btn">
            Выйти
          </button>
        </div>
      </header>
      
      <div className="chat-content">
        <p>Чат будет здесь! 🎉</p>
        <p>Вы успешно авторизованы и можете начать общение.</p>
      </div>
    </div>
  )
}

export default ChatPage
