// utils/apiTest.js
import axios from 'axios';

export const testApiRoutes = async () => {
  try {
    const token = localStorage.getItem('token');
    
    // Тестируем доступные endpoints
    const endpoints = [
      '/api/v1/channels',
      '/api/v1/messages',
      '/api/v1/login'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ ${endpoint}:`, response.data);
      } catch (error) {
        console.log(`❌ ${endpoint}:`, error.response?.status, error.response?.data);
      }
    }
    
    // Проверим WebSocket
    console.log('🔌 WebSocket available:', !!window.io);
    
  } catch (error) {
    console.error('API test error:', error);
  }
};

// Вызовите в консоли браузера: testApiRoutes()

