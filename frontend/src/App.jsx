import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'
import { store } from './store'
import { selectIsAuthenticated } from './store/slices/authSlice'
import ChatPage from './components/ChatPage'
import LoginPage from './components/LoginPage'
import NotFoundPage from './components/NotFoundPage'
import './App.css'

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  )
}

export default App
