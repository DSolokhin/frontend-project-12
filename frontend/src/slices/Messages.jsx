import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { actions as channelsActions } from './Channels'

const messagesAdapter = createEntityAdapter()

const initialState = messagesAdapter.getInitialState()

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
  },
  extraReducers: builder => {
    builder.addCase(channelsActions.removeChannel, (state, action) => {
      const { channelId } = action.payload
      const filtered = Object.values(state.entities).filter(
        msg => msg.channelId !== channelId,
      )
      messagesAdapter.setAll(state, filtered)
    })
  },
})

export const { actions } = messagesSlice
export const selectors = messagesAdapter.getSelectors(
  state => state.messages,
)
export default messagesSlice.reducer
