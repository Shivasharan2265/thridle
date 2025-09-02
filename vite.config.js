import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
    host:true,
     historyApiFallback: true // needed for dev server refresh
  },
  build: {
    outDir: 'dist',
  },
  base: '/', // make sure base is correct if you're hosting in subdirectory
  
  plugins: [react()],
})
