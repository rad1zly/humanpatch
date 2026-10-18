# HumanPatch Pitch Deck - Remotion Generation Prompt v2 (CINEMATIC)

> Paste prompt ini ke LLM apapun (Claude Opus paling oke, Sonnet OK, GPT-4 juga).
> Output: project Remotion 4 + React 18 + TypeScript, dirender dengan
> `npx remotion render HumanPatch out/pitch.mp4` → 90 detik 1080p30 MP4.

---

## 🎬 THE PROMPT (salin semuanya dari sini ke bawah)

```
You are an expert Remotion developer with a cinematography background.
Generate a complete, production-ready Remotion 4 project for a **90-second
cinematic pitch deck** that **SHOWCASES THE REAL, LIVE PRODUCT** called
"HumanPatch - AI Cybersecurity Awareness Trainer".

THE PRODUCT IS LIVE AT: https://humanpatch.taila281c8.ts.net
The 3D-network background and full mobile simulator can be captured via
playwright/headless Chrome before rendering, then composited as static
PNG frames inside this video. Do NOT generate fake UIs from scratch.

─────────────────────────────────────────────────────────────────────
SPECIFICATIONS (HARD)
─────────────────────────────────────────────────────────────────────
• Framework: Remotion 4.0.x + React 18.3 + TypeScript
• Resolution: 1920×1080 (Full HD), fps 30, total 2700 frames (90s)
• NO voiceover - only text + music + visual effects
• Output: `npx remotion render HumanPatch out/pitch.mp4` produces ONE file
• Project boots with `npm install && npx remotion studio` (no network deps at render time)
• Keep total source under 2000 lines across all files

─────────────────────────────────────────────────────────────────────
VISUAL STYLE: "CINEMATIC TECH-COMMERCIAL"
─────────────────────────────────────────────────────────────────────
Aesthetic: Apple-keynote meets documentary-tech. NOT a generic motion-graphics
template. Every scene feels like a real camera shot, not a slide.

Color palette (use as CSS variables):
  --teal:    #0D9488   (primary brand)
  --coral:   #FB7185   (alert/attack)
  --sun:     #FBBF24   (highlight/awareness)
  --mint:    #34D399   (success/safety)
  --sky:     #38BDF8   (info/network)
  --ink:     #0F172A   (deep text)
  --ink-2:   #1E293B   (secondary text)
  --paper:   #FFF7ED   (warm white background)
  --noir:    #020617   (true black for cinematic scenes)

Typography: "Inter" via @remotion/google-fonts/Inter
  - Display 900/950 weight, tight letter-spacing (-0.04em)
  - Body 500/600
  - Captions/labels: monospace "JetBrains Mono" via @remotion/google-fonts/JetBrainsMono

CAMERA LANGUAGE - these are the ONLY motion tools you should use:
  1. Ken Burns zoom (slow interpolate scale 1.0 → 1.15 over 4-8 seconds)
  2. Pan (translateX/Y by small amount with ease-in-out)
  3. Push-in (scale + slight zoom blur for "tension")
  4. Rack focus (CSS filter blur 0→6px→0px simulating depth-of-field shift)
  5. Whip pan (very fast 200-frame translateX with motion-blur via opacity dip)
  6. Handheld shake (translate3d ±2px noise - for "documentary realism")
  7. Letterbox (top+bottom black bars 8% to evoke cinema, 16:9 → 2.35:1 look)
  8. Cut-on-action (hard cut at the moment of impact, no fade)
  9. Speed ramp (time-warp: slow-mo 0.4x then snap to 2x for emphasis)
  10. Vignette (radial gradient darken edges 25%)
  11. Light leak (animated orange/teal gradient overlay sweep, 60% opacity, 90 frames)
  12. Film grain (animated noise SVG overlay, 3% opacity, 24fps pattern)

NEVER USE: bouncy springs, primary color blocks, flat illustrations, emoji as
the main subject. Emojis are OK as ICONS within UI mockups, but the hero
imagery must be the REAL PRODUCT.

─────────────────────────────────────────────────────────────────────
PROJECT STRUCTURE (generate EXACTLY this layout)
─────────────────────────────────────────────────────────────────────
humanpatch-pitch/
├── package.json
├── tsconfig.json
├── remotion.config.ts
├── src/
│   ├── Root.tsx                  ← registers composition
│   ├── index.ts                  ← entry
│   ├── Pitch.tsx                 ← main composition (Sequence of 9 shots)
│   ├── components/
│   │   ├── ShotBase.tsx          ← letterbox + vignette + grain wrapper
│   │   ├── KenBurns.tsx          ← pan/zoom/rotate on a child
│   │   ├── SpeedRamp.tsx         ← warps child playback rate
│   │   ├── WhipPan.tsx           ← fast horizontal motion blur
│   │   ├── LightLeak.tsx         ← animated gradient overlay
│   │   ├── PhoneFrame.tsx        ← realistic phone bezel + status bar
│   │   ├── BrowserFrame.tsx      ← browser chrome (URL bar etc)
│   │   ├── TextReveal.tsx        ← typewriter / word-by-word / letter-by-letter
│   │   ├── Counter.tsx           ← counter that counts up during shots
│   │   ├── StatCard.tsx          ← 3D shadow card with stat
│   │   ├── VFXOverlay.tsx        ← combo: grain + vignette + scanlines
│   │   ├── DataViz.tsx           ← animated bar/line chart for stats
│   │   └── TypeWriter.tsx        ← terminal-style text
│   └── data/
│       ├── shots.ts              ← the 9 shot scripts (timing, text, motion)
│       ├── transcript.ts         ← all on-screen text/captions
│       └── frames.ts             ← metadata for each product frame

─────────────────────────────────────────────────────────────────────
THE 9 SHOTS - CINEMATIC 90 SECONDS
─────────────────────────────────────────────────────────────────────
Total: 2700 frames @ 30fps. Each shot is a real camera move. Use
<Sequence from={N} durationInFrames={D}> inside <Pitch>.

═══════════════════════════════════════════════════════════════════════
SHOT 1 - THE COLD OPEN (0–240 frames, 0:00–0:08) - establish dread
═══════════════════════════════════════════════════════════════════════
• Visual: Black screen. 2-second silence (visually = 60 black frames).
• 60 frames in: faint terminal text appears, typewriter:
  > initializing humanpatch.exe...
  > loading adversarial_model...
  > ready.
• 120 frames: HARD CUT to 3D network background (dark navy + teal nodes)
  Ken Burns slowly zoom in (scale 1.0→1.08 over 120 frames)
• 180 frames: red alert "1 in 3 adults in developing countries hit by
  digital fraud last year" appears word-by-word in monospace
• Music: low synth hum starts here
• VFX: vignette, grain, scanlines
• Camera: slight handheld shake (translate ±2px)

═══════════════════════════════════════════════════════════════════════
SHOT 2 - REAL DASHBOARD SLOW REVEAL (240–600 frames, 0:08–0:20)
═══════════════════════════════════════════════════════════════════════
• Visual: SCREENSHOT of the real landing page from
  https://humanpatch.taila281c8.ts.net - pre-captured to
  public/frames/landing.png (1920x1080)
• Camera: Starts at 1.4× scale centered on hero text, slowly Ken Burns
  zoom out to 1.0× (pulls back to reveal full page) over 360 frames
• 400 frames: topbar slides in from top (-100% → 0, 20-frame ease-out)
  showing the actual nav items: "Cara Kerja · Materi · Dunia"
• 500 frames: light leak (teal→orange) sweeps left-to-right
• Caption (bottom-center, monospace, 14px): "humanpatch.taila281c8.ts.net"
• VFX: 8% letterbox, vignette, grain

═══════════════════════════════════════════════════════════════════════
SHOT 3 - THE PHONE REVEAL (600–960 frames, 0:20–0:32)
═══════════════════════════════════════════════════════════════════════
• Visual: Browser frame in background, fading to 30% opacity. A
  realistic PhoneFrame (375×812 bezel + status bar) zooms in from center
  starting at scale 0.6, ending at scale 1.05 with spring (damping 14)
• The phone shows a SCREENSHOT of the actual game UI
  (pre-captured to public/frames/phone.png)
• Camera: After phone lands, gentle Ken Burns on the phone (scale 1.05→1.0
  for subtle breathing) over the remaining frames
• Text reveal: "Train your reflexes, not your memory." slides in from
  bottom, letter by letter, monospace
• Subtitle: "📱 Real smartphone simulation"
• Counter: "0 → 5" representing days, monospace
• 800 frames: small overlay pops showing "10 cybersecurity domains"
  in 3x4 grid with the 10 emojis (🔐🎣🌐📸📱🚨📞💳🎭👨‍👩‍👧)
• Music: beat drop here, bass kicks in

═══════════════════════════════════════════════════════════════════════
SHOT 4 - THE 10 DOMAINS RAPID FIRE (960–1320 frames, 0:32–0:44)
═══════════════════════════════════════════════════════════════════════
• Visual: 10 domain cards flying in WHIP PAN from right
  (each card translateX 1920→0 over 18 frames, blur 8→0px) staggered
  by 24 frames per card. Total whip-pan window: 240 frames.
• After all 10 land, they settle into a 5×2 grid
  • Speed ramp during the whip-pans: 2× → 1× → 0.5× (slow-mo on settle)
  • Hard CUT between slow-mo and the next shot
• Final state (frames 1260–1320): camera pushes in to grid center,
  scale 1.0 → 1.15, while one card glows teal (the "scam psychology"
  🎭 card - the secret weapon)
• Title (top): "10 domains, taught through your daily life"

═══════════════════════════════════════════════════════════════════════
SHOT 5 - AI IN ACTION (1320–1740 frames, 0:44–0:58)
═══════════════════════════════════════════════════════════════════════
• Split screen 50/50:
  • LEFT: SCREENSHOT of the chat thread "Panitia Beasiswa" (pre-captured
    public/frames/chat-ai.png) - Ken Burns slow zoom 1.0→1.1
  • RIGHT: animated DataViz line chart showing "Suspicion: 0% → 95%"
    rising over 360 frames. Color shifts green→yellow→red.
• 1500 frames: a "threat meter" fills up like a battery
• 1620 frames: word "GIVE UP" appears with red flash overlay
  (light leak 100% opacity, 6 frames, then fades)
• 1680 frames: text reveal: "When the player pushes back... the AI
  surrenders. Real-time. Open-weights."
• Bottom strip: "Powered by AMD MI300X · ROCm · vLLM" (monospace, teal)

═══════════════════════════════════════════════════════════════════════
SHOT 6 - THE 5 WORLDS FLYBY (1740–2040 frames, 0:58–1:08)
═══════════════════════════════════════════════════════════════════════
• Visual: 5 phone-frame cards WHIP PAN in horizontally with stagger
  (same technique as Shot 4 but slower, 30 frames apart)
  Each card: emoji + name + archetype
  🎓 Rani (Pelajar)    🛒 Sari (Pedagang)
  💼 Budi (Pekerja)    🏡 Hendra (Orang Tua)
  🌐 Umum (General)
• After all land: hard CUT to dark navy background with white text
  centered: "ONE PROBLEM. FIVE LIVES. INFINITE OUTCOMES."
  Text reveals letter-by-letter, 60 frames total
• Last 90 frames: zoom out to show all 5 cards again in a row,
  scale 1.0 → 0.8, the cards drift slightly (subtle)

═══════════════════════════════════════════════════════════════════════
SHOT 7 - THE FINALE / COACH DEBRIEF (2040–2400 frames, 1:08–1:20)
═══════════════════════════════════════════════════════════════════════
• Visual: the Chapter 1 FINALE screen (pre-captured public/frames/finale.png)
  scaled to 70% of frame, with cinematic rack focus:
  • Frames 2040–2100: sharp on left card (Score: A, 530 XP)
  • Frames 2100–2160: rack focus → sharp on middle card (🧠 AI Coach)
  • Frames 2160–2220: rack focus → sharp on right card (5 principles)
• 2220 frames: AI coach text "Bagus sekali Rani..." typewriter reveals
  (genuine, warm, in Bahasa Indonesia - use the actual response)
• 2300 frames: bar chart of "Verify +2 · Refuse +1 · Risky -3" animates
  with each bar filling 0→100% over 40 frames staggered
• Music: soaring, hopeful

═══════════════════════════════════════════════════════════════════════
SHOT 8 - IMPACT STATS (2400–2580 frames, 1:20–1:26)
═══════════════════════════════════════════════════════════════════════
• Black background, white monospace text, three StatCards animate in
  one at a time, each on beat (every 60 frames):
  • 5   DAYS PER CHAPTER
  • 10  SECURITY DOMAINS
  • 7   LANGUAGES · 4B+ PEOPLE REACHED
• Each card: scale 0 → 1.1 → 1.0 (spring), with counter ticking up
• Last 60 frames: cards drift down slightly, reveal of "👨‍👩‍👧"

═══════════════════════════════════════════════════════════════════════
SHOT 9 - THE CALL TO ACTION (2580–2700 frames, 1:26–1:30)
═══════════════════════════════════════════════════════════════════════
• Fade from black to logo centered
• Camera: very slow push-in (scale 1.0 → 1.04 over 120 frames)
• Text (monospace, 28px, white): "Try it. Break it. Train your reflexes."
• 2660 frames: URL appears, then GITHUB appears, staggered
  "humanpatch.taila281c8.ts.net"
  "github.com/rad1zly/humanpatch"
• Final 30 frames: vignette darkens to black, logo remains 1 more
  second in 5% opacity (post-credit easter egg)
• Bottom: "Built in 6 days for AMD ACT III Hackathon · Track 4"

─────────────────────────────────────────────────────────────────────
REAL PRODUCT CAPTURE - REQUIRED PRE-RENDER STEP
─────────────────────────────────────────────────────────────────────
Before rendering this pitch, the user must capture these frames using
Playwright (include a `scripts/capture.ts` for them):

```ts
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
mkdirSync('public/frames', { recursive: true });

const pages: Array<{url: string; name: string; wait: number; clip?: any}> = [
  { url: 'https://humanpatch.taila281c8.ts.net/',       name: 'landing',     wait: 4000 },
  { url: 'https://humanpatch.taila281c8.ts.net/#docs/about', name: 'docs',   wait: 2000 },
  { url: 'https://humanpatch.taila281c8.ts.net/#docs/contact', name: 'contact', wait: 2000 },
  // For phone + chat + finale, the user must log in and play first,
  // then screenshot via in-app screen capture or DOM dump
];

const browser = await chromium.launch();
for (const p of pages) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(p.url);
  await page.waitForTimeout(p.wait);
  await page.screenshot({ path: `public/frames/${p.name}.png`, fullPage: false });
  await page.close();
}
await browser.close();
```

The Remotion code must reference these frames via `staticFile('frames/landing.png')`
etc. If a frame is missing, the ShotBase component should show a tasteful
fallback: gradient + text "Frame: landing.png - run scripts/capture.ts".

─────────────────────────────────────────────────────────────────────
REMOTION PATTERNS REQUIRED
─────────────────────────────────────────────────────────────────────
1. Composition registration (Root.tsx):
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

2. SpeedRamp component - child plays at variable rate:
```tsx
export const SpeedRamp: React.FC<{children: React.ReactNode; rate: number}> = ({children, rate}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = Math.floor(frame * rate);
  return <FrameContextProvider value={adjustedFrame}>{children}</FrameContextProvider>;
};
```

3. Ken Burns:
```tsx
export const KenBurns: React.FC<{children; from?: number; to?: number; start?: number; duration?: number}> = ({children, from=1, to=1.05, start=0, duration=60}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [start, start+duration], [from, to], {extrapolateRight: 'clamp'});
  return <div style={{transform: `scale(${scale})`, transformOrigin: 'center center', width: '100%', height: '100%'}}>{children}</div>;
};
```

4. WhipPan:
```tsx
const tx = interpolate(frame, [0, 18, 30], [1920, -50, 0], {extrapolateRight: 'clamp'});
const blur = interpolate(frame, [0, 9, 18], [10, 4, 0], {extrapolateRight: 'clamp'});
```

5. Determinism - no Math.random(). Use:
```ts
const seeded = (s: number) => () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
```

6. Music: include a silent placeholder `public/music.mp3` and
```tsx
<Audio src={staticFile('music.mp3')} volume={0.3} />
```

─────────────────────────────────────────────────────────────────────
CODE GENERATION RULES
─────────────────────────────────────────────────────────────────────
- Generate EVERY file. No "left as exercise" placeholders.
- TypeScript strict, named exports, JSDoc on each shot
- Use `staticFile()` for all local assets
- Inline styles only (no styled-components)
- Include `scripts/capture.ts` (Playwright frame-capture script)
- Include README.md with: setup / capture / preview / render commands
- Render command: `npx remotion render HumanPatch out/pitch.mp4 --concurrency=4`

─────────────────────────────────────────────────────────────────────
OUTPUT FORMAT
─────────────────────────────────────────────────────────────────────
For each file, output ONE code block:
```ts // path/to/file.tsx
<full contents>
```

Files in order:
1. package.json
2. tsconfig.json
3. remotion.config.ts
4. public/.gitkeep (mention where to put music.mp3)
5. src/index.ts
6. src/Root.tsx
7. src/Pitch.tsx
8. src/components/ShotBase.tsx
9. src/components/KenBurns.tsx
10. src/components/SpeedRamp.tsx
11. src/components/WhipPan.tsx
12. src/components/LightLeak.tsx
13. src/components/PhoneFrame.tsx
14. src/components/BrowserFrame.tsx
15. src/components/TextReveal.tsx
16. src/components/Counter.tsx
17. src/components/StatCard.tsx
18. src/components/VFXOverlay.tsx
19. src/components/DataViz.tsx
20. src/components/TypeWriter.tsx
21. src/data/shots.ts
22. src/data/transcript.ts
23. src/data/frames.ts
24. scripts/capture.ts
25. README.md
```

---

## Kenapa v2 ini beda

**v1 (template lama):** emoji storm, gradient block, motion graphics generic, pitch deck "adalah video penjelasan".

**v2 (cinematic):** screenshot produk asli = visual proof, kamera moves (zoom/pan/whip/speed-ramp) = drama, scene-flow 9 shot yang struktur kayak commercial Apple/Linear/Stripe, 7 bahasa retained, AMD tech callout di shot 5.

Yang paling penting: **Shot 2, 3, 5, 7 ambil PNG dari app live lu** (`humanpatch.taila281c8.ts.net`). Jadi juri lihat "ini beneran app yang jalan" bukan mockup. Itu yang bedain pitch deck yang ngomong vs yang nunjukin.

Cara pakai udah sama kayak v1: copy prompt → paste ke LLM → generate → save ke folder `humanpatch-pitch/` → `npm install` → capture frames via `scripts/capture.ts` → render. 🔥