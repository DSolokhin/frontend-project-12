import React from 'react';
import { useDispatch } from 'react-redux';
import { ApiContext } from '../contexts/index.jsx';
import socketService from '../services/socketService';
import { actions as channelsActions } from '../store/slices/channelsSlice.js';
import { actions as messagesActions } from '../store/slices/messagesSlice.js';

const ApiProvider = ({ children }) => {
  const dispatch = useDispatch();

  const socket = socketService.connect(localStorage.getItem('token'));

  // WebSocket listeners
  socket.on('newMessage', (message) => {
    dispatch(messagesActions.addMessage(message));
  });

  socket.on('newChannel', (channel) => {
    dispatch(channelsActions.addChannel(channel));
  });

  socket.on('renameChannel', ({ id, name }) => {
    dispatch(channelsActions.renameChannel({ id, changes: { name } }));
  });

  socket.on('removeChannel', ({ id }) => {
    dispatch(channelsActions.removeChannel(id));
  });

  const addMessage = async (body, channelId, username) => {
    await socket.emit('newMessage', { body, channelId, username });
  };

  const addChannel = async (name) => {
    const newChannel = await socket.emitWithAck('newChannel', { name });
    dispatch(channelsActions.addChannel(newChannel));
    dispatch(channelsActions.changeChannel(newChannel.id));
    return newChannel;
  };

  const renameChannel = async (id, name) => {
    await socket.emit('renameChannel', { id, name });
  };

  const removeChannel = async (id) => {
    await socket.emit('removeChannel', { id });
  };

  return (
    <ApiContext.Provider value={{
      addChannel, addMessage, renameChannel, removeChannel,
    }}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;

