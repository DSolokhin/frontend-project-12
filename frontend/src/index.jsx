import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/index.js'
import App from './App.jsx'
import ApiProvider from './providers/ApiProvider.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ApiProvider>
          <App />
        </ApiProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
