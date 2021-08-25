import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import './index.css'
import { Initialize } from './state/actions/Initialization'

Initialize()

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
