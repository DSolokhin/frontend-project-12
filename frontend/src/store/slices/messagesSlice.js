import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice.js';

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessages: messagesAdapter.addMany,
    addMessage: messagesAdapter.addOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelsActions.removeChannel, (state, action) => {
        const channelId = action.payload;
        const channelMessages = Object.values(state.entities)
          .filter((message) => message.channelId === channelId)
          .map((message) => message.id);
        messagesAdapter.removeMany(state, channelMessages);
      });
  },
});

export const { actions } = messagesSlice;

const selectors = messagesAdapter.getSelectors((state) => state.messages);
export const customSelectors = {
  allMessages: selectors.selectAll,
  currentChannelMessages: (state) => {
    const { currentChannelId } = state.channels;
    return selectors.selectAll(state)
      .filter(({ channelId }) => channelId === currentChannelId);
  },
};

export default messagesSlice.reducer;
