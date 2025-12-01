import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './Channels';
import messagesReducer from './Messages';
import modalReducer from './Modals';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    modal: modalReducer,
  },
});
