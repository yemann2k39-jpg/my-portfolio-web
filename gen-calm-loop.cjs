// Generates public/music/calm-loop.wav — a soft ambient pad loop (32s, stereo 22.05kHz 16-bit)
const fs = require('fs');
const sr = 22050, dur = 32, n = sr * dur;
const chords = [
  [130.81, 196.00, 246.94, 329.63], // Cmaj7
  [110.00, 164.81, 220.00, 261.63], // Am7
  [174.61, 220.00, 261.63, 349.23], // Fmaj7
  [196.00, 246.94, 293.66, 392.00], // G6
];
const seg = n / 4, fade = 8000;
const data = Buffer.alloc(n * 4);
for (let i = 0; i < n; i++) {
  const segIdx = Math.min(3, Math.floor(i / seg));
  const t = (i - segIdx * seg) / sr;
  const fs4 = chords[segIdx];
  let env = 1.0;
  if (t < 2.0) env *= t / 2.0;
  if (8.0 - t < 2.0) env *= (8.0 - t) / 2.0;
  env *= 0.5;
  let l = 0, r = 0;
  for (let k = 0; k < 4; k++) {
    const f = fs4[k], w = 2 * Math.PI * f;
    const v = 1 + 0.003 * Math.sin(2 * Math.PI * 0.25 * t + k);
    const s = Math.sin(w * v * t) + 0.25 * Math.sin(2 * w * v * t) + 0.08 * Math.sin(3 * w * v * t);
    const pan = 0.5 + 0.3 * Math.sin(k * 1.7);
    l += s * (1 - pan); r += s * pan;
  }
  l *= env * 0.22; r *= env * 0.22;
  const g = i < fade ? i / fade : (n - i < fade ? (n - i) / fade : 1.0);
  l *= g; r *= g;
  data.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(l * 32767))), i * 4);
  data.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(r * 32767))), i * 4 + 2);
}
const h = Buffer.alloc(44);
h.write('RIFF', 0); h.writeUInt32LE(n * 4 + 36, 4); h.write('WAVEfmt ', 8);
h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22);
h.writeUInt32LE(sr, 24); h.writeUInt32LE(sr * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34);
h.write('data', 36); h.writeUInt32LE(n * 4, 40);
fs.writeFileSync('public/music/calm-loop.wav', Buffer.concat([h, data]));
console.log('wrote public/music/calm-loop.wav', n * 4 + 44, 'bytes');
