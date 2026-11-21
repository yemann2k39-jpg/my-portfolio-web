import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { handleChat } from './server/chat-handler.mjs'

// load .env for local dev (Vercel injects GEMINI_API_KEY itself in prod)
function loadEnv() {
  try {
    for (const line of readFileSync(join(__dirname, '.env'), 'utf8').split('\n')) {
      const m = line.match(/^([A-Z_]+)=(.*)$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
    }
  } catch { /* no .env — fine */ }
}

// dev middleware: serve POST /api/chat the same way the Vercel function does
function chatApiPlugin() {
  return {
    name: 'chat-api',
    configureServer(server) {
      loadEnv()
      server.middlewares.use('/api/chat', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end('POST only')
        }
        let body = ''
        req.on('data', (c) => (body += c))
        req.on('end', async () => {
          let json = {}
          try { json = JSON.parse(body || '{}') } catch { /* ignore */ }
          const ip = req.socket?.remoteAddress || 'local'
          const out = await handleChat(json, ip)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(out))
        })
      })
    },
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url))

// base: './' keeps asset paths relative so the build works on any static host
export default defineConfig({
  base: './',
  server: {
    port: 3301,
    strictPort: true, // fail loudly instead of silently jumping to another port
  },
  plugins: [react(), tailwindcss(), chatApiPlugin()],
})
