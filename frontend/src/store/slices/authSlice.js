// store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit'

// Восстанавливаем данные из localStorage при инициализации
const token = localStorage.getItem('token')
const username = localStorage.getItem('username')

console.log('🔐 [authSlice] Initializing with token:', token)
console.log('🔐 [authSlice] Initializing with username:', username)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: username ? { username } : null,
    token: token,
    isAuthenticated: !!token,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload
      console.log('🔐 [authSlice] setCredentials called with:', { user, token })
      
      state.user = user
      state.token = token
      state.isAuthenticated = true
      localStorage.setItem('token', token)
      localStorage.setItem('username', user.username)
      
      console.log('🔐 [authSlice] After setCredentials - state:', state)
    },
    logout: (state) => {
      console.log('🔐 [authSlice] logout called')
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('username')
    },
    // ДОБАВЬТЕ ЭТОТ РЕДЬЮСЕР - он синхронизирует Redux с localStorage
    initializeAuth: (state) => {
      const token = localStorage.getItem('token')
      const username = localStorage.getItem('username')
      console.log('🔐 [authSlice] initializeAuth - token:', token, 'username:', username)
      
      state.token = token
      state.user = username ? { username } : null
      state.isAuthenticated = !!token
    }
  },
})

export const { setCredentials, logout, initializeAuth } = authSlice.actions
export default authSlice.reducer

// Селекторы
export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
