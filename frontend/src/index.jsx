import React from 'react'
import ReactDOM from 'react-dom/client'
import init from './init'
import 'bootstrap/dist/css/bootstrap.min.css'

const renderApp = async () => {
  const root = ReactDOM.createRoot(document.getElementById('chat'))
  const vdom = await init()
  root.render(
    <React.StrictMode>
      {vdom}
    </React.StrictMode>
  )
}

renderApp()
