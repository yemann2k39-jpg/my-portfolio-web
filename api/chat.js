// Vercel serverless function: POST /api/chat { message, history } → { reply }
import { handleChat } from '../server/chat-handler.mjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown'
  const out = await handleChat(req.body, ip)
  return res.status(200).json(out)
}
