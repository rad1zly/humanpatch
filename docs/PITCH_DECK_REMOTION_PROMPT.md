# HumanPatch Pitch Deck — Remotion Generation Prompt

> Paste prompt ini ke LLM apapun (Claude, GPT-4, MiniMax, dll). Output yang
> diharapkan: project Remotion lengkap (Remotion 4 + React 18 + TypeScript) yang
> bisa di-render dengan `npx remotion render HumanPatch out/pitch.mp4`.

---

## 🎬 THE PROMPT (salin semuanya dari sini ke bawah)

```
You are an expert Remotion developer. Generate a complete, production-ready
Remotion 4 project for a **90-second pitch deck video** about an app called
"HumanPatch — AI Cybersecurity Awareness Trainer for Developing Countries".

─────────────────────────────────────────────────────────────────────
SPECIFICATIONS (HARD REQUIREMENTS)
─────────────────────────────────────────────────────────────────────
• Framework: Remotion 4.0.x with React 18.3 + TypeScript
• Resolution: 1920×1080 (Full HD)
• Frame rate: 30 fps
• Total duration: 90 seconds = 2700 frames
• Output: 1 single MP4 file via `npx remotion render HumanPatch out/pitch.mp4`
• NO voiceover — text + icon animations + background music only
• NO external API calls during render (everything offline + deterministic)
• Project must work with `npm install && npx remotion studio` immediately

─────────────────────────────────────────────────────────────────────
VISUAL STYLE: "PLAYFUL VIBRANT"
─────────────────────────────────────────────────────────────────────
- Color palette (use as CSS variables):
  --teal:     #0D9488   (primary brand)
  --coral:    #FB7185   (accent, danger/alert)
  --sun:      #FBBF24   (highlight, wins)
  --mint:     #34D399   (success)
  --sky:      #38BDF8   (info, network)
  --ink:      #0F172A   (text on light)
  --paper:    #FFF7ED   (warm off-white background)
  --ink-2:    #1E293B   (text secondary)
- Typography: Use "Inter" via @remotion/google-fonts/Inter
  (fallback to system-ui if offline). Headings 800/900, body 500.
- Emojis used HEAVILY as illustration (🛡️ 🎣 📱 🚨 💳 👨‍👩‍👧 🎓 🛒 💼 🏡 etc.)
- Every scene is a CSS gradient background with floating emoji particles
  (animated position, opacity, rotation — 5-10 emojis per scene, deterministic
  seeded random so re-renders are identical)
- All animations use `spring()` or `interpolate()` from Remotion — no CSS
  transitions (those don't work in Remotion)
- Add subtle scene transitions: 12-frame cross-fade + 4-frame scale (0.95→1)

─────────────────────────────────────────────────────────────────────
PROJECT STRUCTURE (generate EXACTLY this layout)
─────────────────────────────────────────────────────────────────────
humanpatch-pitch/
├── package.json
├── tsconfig.json
├── remotion.config.ts
├── src/
│   ├── Root.tsx                  ← registers all compositions
│   ├── index.ts                  ← entry for remotion.config
│   ├── Pitch.tsx                 ← main composition (Sequence of 8 scenes)
│   ├── components/
│   │   ├── SceneBase.tsx         ← gradient bg + floating emojis + scene title
│   │   ├── PhoneMockup.tsx       ← 320×650 CSS phone frame with optional screen
│   │   ├── TextPop.tsx           ← word-by-word text reveal animation
│   │   ├── Counter.tsx           ← animated number counter
│   │   ├── NetworkBg.tsx         ← floating emoji network background
│   │   ├── Badge.tsx             ← pill-shaped chip
│   │   └── LogoMark.tsx          ← 🛡️ + "HumanPatch" wordmark
│   └── data/
│       ├── scenes.ts             ← the 8 scene scripts
│       └── domainIcons.ts        ← emoji + color per cybersecurity domain

─────────────────────────────────────────────────────────────────────
THE 8 SCENES (90 seconds total = 2700 frames)
─────────────────────────────────────────────────────────────────────
Each scene ~11 seconds (~330 frames). Use `<Sequence from={N} durationInFrames={D}>`
inside the main <Pitch> component.

SCENE 1: HOOK (0–360 frames, 0:00–0:12) — bg gradient teal→coral
  • TextPop word-by-word reveal: "Every 39 seconds..."
  • Counter: 0 → 2,200 (a number that ticks up, formatted with commas)
  • Subtitle: "someone in a developing country falls for a digital scam"
  • Emoji storm: 🎣💳🚨📱 rotating into view

SCENE 2: THE PROBLEM (360–720 frames, 0:12–0:24) — bg coral→sun
  • Two phone mockups side by side. Left shows fake "Beasiswa Lolos ✓" message
    with sketchy URL. Right shows an elderly parent confused by "CS Bank" call.
  • Text: "Awareness training is boring, expensive, and Western-centric."
  • 3 badges appear with stagger: ❌ "Boring slides" ❌ "$500/course" ❌ "Out of context"

SCENE 3: THE SOLUTION (720–1080 frames, 0:24–0:36) — bg sun→mint
  • Big animated 🛡️ logo, springs in
  • Wordmark "HumanPatch" with subtitle "Train your reflexes, not your memory"
  • 3 pillars slide in from bottom:
    📱 "Phone-first simulation"
    🧠 "Adaptive AI adversary"
    🌍 "7 languages, local context"

SCENE 4: HOW IT WORKS (1080–1440 frames, 0:36–0:48) — bg mint→sky
  • 3 steps in a horizontal timeline:
    1️⃣ "Pick your world" (show 5 persona avatars fading in)
    2️⃣ "Live 5 days" (calendar emoji filling)
    3️⃣ "Coach debrief" (chat bubble with text appearing)
  • Animated arrows between steps

SCENE 5: THE 10 DOMAINS (1440–1800 frames, 0:48–1:00) — bg sky→teal
  • 10 domain badges in a 5×2 grid, popping in with stagger
  • Domains: 🔐Passwords 🎣Phishing 🌐Browsing 📸Privacy 📱MobileSecurity
    🚨Reporting 📞ScamCalls 💳Payments 🎭ScamPsychology 👨‍👩‍👧Family
  • Title: "10 cybersecurity domains, taught through your daily life"

SCENE 6: AI IN ACTION (1800–2160 frames, 1:00–1:12) — bg teal→coral
  • Split screen: LEFT = chat thread "Panitia Beasiswa" with a real AI
    scammer's response appearing word-by-word. RIGHT = threat meter rising
    (green → yellow → red) as suspicion increases.
  • Footer: "Powered by open-weights LLMs on AMD MI300X"

SCENE 7: IMPACT (2160–2520 frames, 1:12–1:24) — bg coral→mint
  • 3 big animated counters with stagger:
    "5" = "days per chapter"
    "10" = "security domains"
    "7" = "languages for 4B+ people"
  • Each counter scales up and pulses when it lands on the final value

SCENE 8: CTA (2520–2700 frames, 1:24–1:30) — bg mint→teal
  • Logo big in center
  • Text: "Try it. Break it. Train your reflexes."
  • Below: "humanpatch.taila281c8.ts.net  ·  github.com/rad1zly/humanpatch"
  • Tiny line: "Built in 6 days for AMD ACT III Hackathon"
  • End with a final 🛡️ that pulses 3 times

─────────────────────────────────────────────────────────────────────
REQUIRED REACT/REMOTION PATTERNS
─────────────────────────────────────────────────────────────────────
1. Composition registration in Root.tsx:
   ```tsx
   <Composition
     id="HumanPatch"
     component={Pitch}
     durationInFrames={2700}
     fps={30}
     width={1920}
     height={1080}
   />
   ```

2. All animations must use Remotion's primitives:
   - `useCurrentFrame()` for time
   - `useVideoConfig()` for fps, width, height
   - `interpolate(frame, [from, to], [0, 1], {extrapolateRight: 'clamp'})`
   - `spring({frame, fps, config: {damping: 12, stiffness: 100}})`
   - `<Sequence from={N} durationInFrames={D}>` for scene timing
   - `<AbsoluteFill>` for layering

3. Determinism: NO `Math.random()` directly. Use a seeded RNG:
   ```ts
   const seeded = (seed: number) => () => {
     seed = (seed * 9301 + 49297) % 233280;
     return seed / 233280;
   };
   ```

4. Floating emoji particles: 8 per scene, each with:
   - Random initial position (seeded)
   - Drift animation: 60-frame loop with sin/cos oscillation
   - Rotation: 0 → 360 over 120 frames
   - Opacity: 0.15 base (subtle background)

5. Scene transitions: 16 frames cross-fade between consecutive scenes.
   Use `<Series>` or manual opacity interpolation on each scene container.

6. Music track: include a silent placeholder file at
   `public/music.mp3` and a comment in the code showing where to drop a
   real CC0 track (e.g. from Pixabay). Use `<Audio src={staticFile('music.mp3')} volume={0.3} />`.

─────────────────────────────────────────────────────────────────────
CODE GENERATION RULES
─────────────────────────────────────────────────────────────────────
- Generate EVERY file. Do not say "this is left as an exercise".
- Use TypeScript strict mode
- Use named exports for components
- Add JSDoc comments on each scene's purpose
- Use `staticFile()` from "remotion" for any local assets
- All inline styles as `style={{...}}` (no styled-components to keep deps minimal)
- Keep total source under 1500 lines across all files
- Include a README.md with:
  - Setup: `npm install`
  - Preview: `npx remotion studio`
  - Render: `npx remotion render HumanPatch out/pitch.mp4`
  - Render still: `npx remotion still HumanPatch out/thumbnail.png`

─────────────────────────────────────────────────────────────────────
OUTPUT FORMAT
─────────────────────────────────────────────────────────────────────
Respond with each file in its own code block tagged with the file path:

```ts // src/Root.tsx
<full file contents>
```

Do this for ALL files in the project structure above. Begin with
package.json, then tsconfig.json, then remotion.config.ts, then all
src/ files. End with README.md.
```

---

## Catatan tambahan

**Cara pakai prompt di atas:**

1. **Copy** seluruh blok antara ` ``` ` markers
2. **Paste** ke LLM (Claude Sonnet/Opus paling oke untuk code quality, GPT-4 juga OK, MiniMax-M3 cukup buat scaffolding cepat)
3. **Generate** → akan keluar ~10-15 file code blocks
4. **Bikin folder** `humanpatch-pitch/` di laptop lu
5. **Paste** masing-masing file ke path yang ditentukan
6. `npm install && npx remotion studio` → preview di browser
7. `npx remotion render HumanPatch out/pitch.mp4` → render ke MP4 (5-15 menit untuk 90 detik di laptop standar)

**Yang gue udah verifikasi env lu:**
- Node v22.22.3 ✅
- npm 10.9.8 ✅
- ffmpeg 8.0.1 ✅ (Remotion butuh untuk encoding)
- Remotion 4.0.535 latest

**Timing render estimasi** (laptop gaming kelas menengah, i7/Ryzen 7, GPU onboard):
- Preview di studio: instant
- Render 90 detik @ 1080p30: 8-20 menit tergantung CPU
- Render with `--concurrency=4` flag: ~2× lebih cepat
- Pakai GPU (Remotion mendukung WebGL/GPU encoding via `--gl=angle`): 3-5 menit

**Kalau mau LLM lain ngehasilin beda output** (mis. minta versi tanpa TypeScript, atau pakai Tailwind, atau remix jadi 60 detik), tinggal bilang — gue tweak promptnya.

File ini udah ke-commit di `docs/PITCH_DECK_REMOTION_PROMPT.md` supaya gak hilang. 🔥