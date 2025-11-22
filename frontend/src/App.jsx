// App.jsx
import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { selectIsAuthenticated, initializeAuth } from './store/slices/authSlice'
import ChatPage from './components/ChatPage'
import LoginPage from './components/LoginPage'
import RegistrationPage from './components/RegistrationPage'
import NotFoundPage from './components/NotFoundPage'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" />
}

const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  return !isAuthenticated ? children : <Navigate to="/" />
}

function App() {
  const dispatch = useDispatch()

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
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <RegistrationPage />
            </PublicRoute>
          } 
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      
      {/* Toast уведомления */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default App
