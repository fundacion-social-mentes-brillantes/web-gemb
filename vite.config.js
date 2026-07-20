import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Separa las librerías grandes del código propio para que el home
        // descargue solo lo necesario (requisito de velocidad de Ad Grants).
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'firebase'
            // jspdf/html2canvas NO se agrupan a mano: solo los importa el test
            // (lazy) y agruparlos crea una arista estática desde el entry.
            if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('purify') || id.includes('canvg')) return undefined
            if (id.includes('react') || id.includes('scheduler')) return 'react'
            return 'vendor'
          }
        }
      }
    }
  }
})
