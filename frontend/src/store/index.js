import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import channelsReducer from './slices/channelsSlice'
import messagesReducer from './slices/messagesSlice'
import { chatApi } from './api/chatApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    channels: channelsReducer,
    messages: messagesReducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatApi.middleware),
})

export default store
