// App.jsx
import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsAuthenticated, initializeAuth } from './store/slices/authSlice'
import ChatPage from './components/ChatPage'
import LoginPage from './components/LoginPage'
import NotFoundPage from './components/NotFoundPage'
import './App.css'

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  const dispatch = useDispatch()

  // Инициализируем авторизацию при загрузке приложения
  useEffect(() => {
    console.log('🔐 [App] Initializing auth from localStorage...')
    dispatch(initializeAuth())
  }, [dispatch])

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          } 
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
