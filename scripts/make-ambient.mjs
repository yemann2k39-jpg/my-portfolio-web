// Generates a soft ambient loop as a placeholder background track.
// Swap public/music/ambient-loop.wav with your own file anytime —
// same filename means no code changes needed.
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'public', 'music', 'ambient-loop.wav')

const SR = 44100
const DUR = 24 // seconds
const N = SR * DUR

// A gentle A-major-ish pad: root, fifth, octave, third — low and warm.
const voices = [
  { f: 110.0, amp: 0.30, lfo: 0.050, detune: 0.0008 },  // A2
  { f: 164.81, amp: 0.22, lfo: 0.083, detune: -0.0006 }, // E3
  { f: 220.0, amp: 0.18, lfo: 0.111, detune: 0.0005 },   // A3
  { f: 277.18, amp: 0.10, lfo: 0.067, detune: -0.0004 }, // C#4
  { f: 329.63, amp: 0.07, lfo: 0.129, detune: 0.0003 },  // E4
]

const samples = new Float64Array(N)
let peak = 0

for (let i = 0; i < N; i++) {
  const t = i / SR
  let s = 0
  for (const v of voices) {
    // two slightly detuned oscillators per voice = soft chorus
    const a =
      Math.sin(2 * Math.PI * v.f * (1 + v.detune) * t) +
      Math.sin(2 * Math.PI * v.f * (1 - v.detune) * t + 0.6)
    // slow tremolo gives the pad a breathing motion
    const trem = 0.6 + 0.4 * Math.sin(2 * Math.PI * v.lfo * t + v.f)
    s += (a / 2) * v.amp * trem
  }
  // global fade in/out so the loop point is silent & seamless
  const fade = Math.min(1, t / 3, (DUR - t) / 3.5)
  samples[i] = s * fade
  peak = Math.max(peak, Math.abs(samples[i]))
}

// normalize to a quiet background level
const gain = peak > 0 ? 0.5 / peak : 1
const pcm = Buffer.alloc(N * 2)
for (let i = 0; i < N; i++) {
  const v = Math.max(-1, Math.min(1, samples[i] * gain))
  pcm.writeInt16LE(Math.round(v * 32767), i * 2)
}

const header = Buffer.alloc(44)
header.write('RIFF', 0)
header.writeUInt32LE(36 + pcm.length, 4)
header.write('WAVE', 8)
header.write('fmt ', 12)
header.writeUInt32LE(16, 16) // PCM chunk size
header.writeUInt16LE(1, 20) // format = PCM
header.writeUInt16LE(1, 22) // mono
header.writeUInt32LE(SR, 24)
header.writeUInt32LE(SR * 2, 28) // byte rate
header.writeUInt16LE(2, 32) // block align
header.writeUInt16LE(16, 34) // bits per sample
header.write('data', 36)
header.writeUInt32LE(pcm.length, 40)

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, Buffer.concat([header, pcm]))
console.log(`Wrote ${OUT} (${((44 + pcm.length) / 1024 / 1024).toFixed(2)} MB, ${DUR}s loop)`)
