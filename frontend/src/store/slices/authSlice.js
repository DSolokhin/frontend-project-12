import { createSlice } from '@reduxjs/toolkit'

// Восстанавливаем данные из localStorage при инициализации
const token = localStorage.getItem('token')
const username = localStorage.getItem('username')

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
      state.user = user
      state.token = token
      state.isAuthenticated = true
      localStorage.setItem('token', token)
      localStorage.setItem('username', user.username)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('username')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer

// Селекторы
export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
