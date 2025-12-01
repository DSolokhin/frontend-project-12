import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState({ currentChannelId: 1 });

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    addChannels: channelsAdapter.addMany,
    removeChannel: channelsAdapter.removeOne,
    renameChannel: channelsAdapter.updateOne,
    setChannelId: (state, { payload }) => ({ ...state, currentChannelId: payload }),
  },
});

const { actions } = channelsSlice;
const selectors = channelsAdapter.getSelectors((state) => state.channels);
const getCurrentChannel = (state) => {
  const { currentChannelId } = state.channels;
  const channelsMass = Object.values(state.channels.entities);
  return channelsMass.find((channel) => channel.id === currentChannelId);
};
export { actions, selectors, getCurrentChannel };
export default channelsSlice.reducer;
