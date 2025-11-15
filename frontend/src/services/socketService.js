// services/socketService.js
class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket) return;

    try {
      this.socket = io();
      this.isConnected = true;
      
      this.socket.on('connect', () => {
        console.log('🔌 WebSocket connected');
        this.isConnected = true;
        this.emit('connectionStatus', { status: 'connected' });
      });

      this.socket.on('disconnect', () => {
        console.log('🔌 WebSocket disconnected');
        this.isConnected = false;
        this.emit('connectionStatus', { status: 'disconnected' });
      });

      this.socket.on('error', (error) => {
        console.error('🔌 WebSocket error:', error);
        this.emit('error', error);
      });

      // Слушаем новые сообщения от сервера
      this.socket.on('newMessage', (message) => {
        console.log('📨 New message via WebSocket:', message);
        this.emit('newMessage', message);
      });

    } catch (error) {
      console.error('🔌 WebSocket connection failed:', error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const listeners = this.listeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in listener for ${event}:`, error);
        }
      });
    }
  }

  // Отправка сообщения через WebSocket
  sendMessage(message) {
    if (!this.isConnected) {
      throw new Error('WebSocket not connected');
    }
    
    return new Promise((resolve, reject) => {
      this.socket.emit('newMessage', message, (response) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }
}

export const socketService = new SocketService();

