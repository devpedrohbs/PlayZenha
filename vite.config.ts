import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      'playzenha-production.up.railway.app' // Adicione o seu domínio aqui
    ],
    // Dica: adicione também a porta e o host para o Railway encontrar o app
    port: 8080,
    host: true 
  }
})