
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import "./index.css"; // ✅ Ensure Tailwind styles are loaded
createRoot(document.getElementById('root')).render(
  
    <BrowserRouter>
    <App />
    </BrowserRouter>
    
)
