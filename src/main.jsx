import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

setTimeout(()=>{const a=document.querySelector("aside")||document.querySelector("[class*=sidebar]");if(!a)return;const b=document.createElement("button");b.id="mobile-menu-toggle";b.innerHTML="☰";b.setAttribute("aria-label","القائمة");document.body.appendChild(b);const o=document.createElement("div");o.id="mobile-menu-overlay";document.body.appendChild(o);b.onclick=()=>document.body.classList.toggle("sidebar-open");o.onclick=()=>document.body.classList.remove("sidebar-open");a.addEventListener("click",e=>{if(e.target.closest("a")||e.target.closest("button"))document.body.classList.remove("sidebar-open")})},800);