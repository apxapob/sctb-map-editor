import React, { createRoot } from 'react-dom/client'
import App from './components/App'
import './index.css'
import { Initialize } from './state/actions/Initialization'

Initialize()

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(<App />)
