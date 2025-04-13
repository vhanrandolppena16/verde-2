import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// import path from 'path'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist', // Ensures Vercel knows where the output goes
  },
  server: {
    port: 5173, // Optional: for local dev consistency
  }

  // resolve: {
  //   alias: {
  //     firebase: path.resolve(__dirname, 'node_modules/firebase')
  //   }
  // }
  
})
