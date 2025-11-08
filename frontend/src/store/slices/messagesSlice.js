import { createSlice } from '@reduxjs/toolkit'

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(msg => msg.id !== action.payload)
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setMessages,
  addMessage,
  removeMessage,
  setLoading,
  setError,
} = messagesSlice.actions

export default messagesSlice.reducer

// Селекторы
export const selectMessages = (state) => state.messages.messages
export const selectMessagesByChannel = (channelId) => (state) =>
  state.messages.messages.filter(msg => msg.channelId === channelId)
export const selectMessagesLoading = (state) => state.messages.loading
export const selectMessagesError = (state) => state.messages.error

