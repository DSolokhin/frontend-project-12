import { createContext, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { actions as channelsActions } from '../store/slices/channelsSlice';

export const AuthContext = createContext({});
export const ApiContext = createContext({});

// Хук для работы с API
export const useApi = () => {
  const dispatch = useDispatch();

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }, []);

  // Добавление сообщения
  const addMessage = async (body, channelId, username) => {
    try {
      const response = await fetch('/api/v1/messages', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ body, channelId, username }),
      });

      if (!response.ok) throw new Error('Send message failed');
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  };

  // Добавление канала
  const addChannel = async (name) => {
    try {
      const response = await fetch('/api/v1/channels', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error('Add channel failed');
      
      const data = await response.json();
      dispatch(channelsActions.addChannel(data));
      return data;
    } catch (error) {
      console.error('Add channel error:', error);
      throw error;
    }
  };

  // Переименование канала
  const renameChannel = async (channelId, newName) => {
    try {
      const response = await fetch(`/api/v1/channels/${channelId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) throw new Error('Rename channel failed');
      
      const data = await response.json();
      dispatch(channelsActions.renameChannel({ id: channelId, name: newName }));
      return data;
    } catch (error) {
      console.error('Rename channel error:', error);
      throw error;
    }
  };

  // Удаление канала
  const removeChannel = async (channelId) => {
    try {
      const response = await fetch(`/api/v1/channels/${channelId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Remove channel failed');
      
      dispatch(channelsActions.removeChannel(channelId));
    } catch (error) {
      console.error('Remove channel error:', error);
      throw error;
    }
  };

  return {
    addMessage,
    addChannel,
    renameChannel,
    removeChannel,
  };
};
