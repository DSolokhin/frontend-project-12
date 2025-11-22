// src/services/socketService.js
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    if (!this.socket) {
      this.socket = io('/', {
        auth: {
          token: token
        }
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket) {
      return this.socket.emit(event, data);
    }
  }

  emitWithAck(event, data) {
    if (this.socket) {
      return this.socket.emitWithAck(event, data);
    }
  }
}

export default new SocketService();
