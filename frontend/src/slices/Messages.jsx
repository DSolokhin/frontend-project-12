import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { actions as channelsActions } from './Channels';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messages = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
  },
  extraReducers: (builder) => {
    builder.addCase(channelsActions.removeChannel, (state, action) => {
      const { channelId } = action.payload;
      const update = Object.values(state.entities).filter((e) => e.channelId !== channelId);
      messagesAdapter.setAll(state, update);
    });
  },
});

export const { actions } = messages;
export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export default messages.reducer;
