# LinguaBridge

A modern, fully responsive language learning web application for Russian and Kyrgyz speakers to learn **German** and **English**.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (glassmorphism UI)
- **Zustand** (auth, app state, progress)
- **Lucide React** (icons)
- **Web Speech API** (TTS + voice search)

## Features

- Strict authentication gate (Sign Up / Log In)
- 4 language pairs: Kyrgyz→German, Kyrgyz→English, Russian→German, Russian→English
- CEFR levels A0–C1 with 100 lessons per level (scalable factory)
- Vocabulary cards with reading guides, definitions, and TTS
- Dictionary with voice search and RU/KY translation tabs
- Profile editing with instant global state updates
- Settings: notifications, theme, interface language

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/(app)/          # Protected routes (auth-gated)
├── components/         # UI, auth, layout, pages
├── data/               # Lesson factory & mock data
├── lib/                # Constants, speech, utils
├── store/              # Zustand stores
└── types/              # TypeScript interfaces
```

## Browser Notes

- **Text-to-Speech** requires a browser with `speechSynthesis` support (Chrome, Edge, Safari).
- **Voice Search** requires `SpeechRecognition` (Chrome/Edge recommended).
