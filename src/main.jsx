import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerServiceWorker } from './registerServiceWorker.js'

const container = document.getElementById('root')
const tree = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Las rutas públicas llegan prerenderizadas (SSG): React hidrata ese HTML en
// lugar de reemplazarlo, así el contenido servido y el visible son el mismo.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}

registerServiceWorker()
