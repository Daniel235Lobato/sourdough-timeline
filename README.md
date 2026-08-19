# Levain 🍞 — Minimalist Sourdough Baking Timeline App

> Smart forward & reverse scheduling, real-time biological fermentation tracking, and visual animated timelines.

---

## 🌟 Core Features

- **Dual-Mode Smart Scheduling**:
  - **"Start When?" (Forward Scheduling)**: Choose when you want to begin feeding your starter; the engine projects the entire schedule down to the exact minute.
  - **"Bake By?" (Reverse Scheduling / "Arrive By")**: Enter your target ready time (e.g. *Saturday 10:00 AM*), and the engine works backward to recommend the exact starter feeding time (e.g. *Friday at 4:00 AM*).
- **"NOW" Real-Time Experience**:
  - Live countdown timers to upcoming milestones.
  - Visual biological indicators: Effervescent starter yeast bubbles, expanding bulk dough (50–75% rise), cold retard climate, oven radiant heat, and wire rack cooling.
  - Instant biological overrides (*"Bulk is Ready Now"*, *"Starter Peaked"*).
- **"I'm Running Behind"**: Dynamic rescheduling for real-world biological delays without compromising minimum fermentation safety.
- **Recipe Management & Builder**:
  - Preset library (Classic Country Loaf, Tartine High Hydration 78%, Rustic Whole Wheat, Same-Day Express).
  - Dynamic loaf batch scaler (1, 2, 3, 4 loaves).
  - Visual step builder to create and save custom sourdough workflows.
- **Baker's Percentages & Hydration Calculator**: Interactive sliders with beginner, intermediate, and mastery handling cues.
- **Bake Journal & History**: 5-star ratings, crumb notes, ambient temperature, and flour tracking with persistent LocalStorage archive.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd SourDough

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Audio**: Web Audio API Chimes
- **Celebration**: canvas-confetti
