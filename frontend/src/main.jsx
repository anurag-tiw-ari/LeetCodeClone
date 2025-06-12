import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { ToastContainer } from "react-toastify";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
       <App /> 
       <ToastContainer />
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)
