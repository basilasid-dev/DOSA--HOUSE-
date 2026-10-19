# 🥞 DOSA HOUSE (தோசை ஹவுஸ்)

> A cozy, atmospheric browser-based South Indian cooking simulation game built with **Vite**, **Phaser 3**, and **TypeScript**.

---

## 🎨 Theme & Visual Design
- **Warm Cream** (`#FFF8EE` / `#FDF4E3`) – Fresh batter & coconut chutney
- **Turmeric Yellow & Mustard** (`#F3A712` / `#FFC107`) – Golden ghee roast crust & potato masala
- **Terracotta & Brick** (`#C15C3D` / `#9E3B20`) – Clay tandoors & fiery tomato thokku
- **Teak & Rosewood** (`#3D2314` / `#24140B`) – Hand-carved traditional chettinad wood panels & signboards
- **Curry Leaf & Banana Leaf Green** (`#3E6B48` / `#2E6B34`) – Fresh plantain leaf platters & tadka
- **Embossed Brass** (`#D4AF37` / `#F8D858`) – Authentic dabarah tumblers, thooku vilakku lamps & rivets

---

## 🎮 Features Implemented

### 1. Main Menu Experience
- **Responsive Layout**: Powered by Phaser Scale Manager (`Phaser.Scale.FIT` and `CENTER_BOTH`), seamlessly scaling across desktop monitors, tablets, and mobile phones.
- **Atmospheric South Indian Restaurant Backdrop**: Warm interior with carved teak pillars, marigold garlands, and ambient dining glow.
- **Centerpiece Food Artwork**: Glistening cone-shaped crispy Masala Dosa served on a vibrant green banana leaf plate with steel katoris of steaming sambar, coconut chutney, and red tomato chutney.
- **Steam Particle System**: Real-time procedural steam wisps rising from the hot dosa and bubbling sambar.
- **Interactive Hanging Brass Bells**: Click the temple bells hanging from the toran header to hear them chime and swing with physics tweening.
- **Procedural Sound Engine (`SoundFX.ts`)**: Built with the HTML5 Web Audio API, synthesizing crisp wooden clicks, brass bell chimes, realistic sizzling hot tawa sounds, and ambient cafe drone without external audio files.

### 2. Interactive Navigation
- **Play Game (`GameScene`)**: Transitions into the kitchen counter with an interactive cast-iron tawa (click to hear the tawa sizzle!), sample customer order ticket for Table 3, and heat gauges.
- **Recipe Book (`RecipeBookModal`)**: Interactive traditional cookbook with 5 South Indian specialties:
  1. *Plain Golden Roast (Ney Roast)*
  2. *Classic Masala Dosa*
  3. *Ghee Podi Roast (Gunpowder Dosa)*
  4. *Caramelized Onion Uthappam*
  5. *Mysore Royal Masala Dosa*
  Each recipe includes ingredients, step-by-step tawa techniques, difficulty ratings, calories, and cultural culinary lore.
- **Settings Modal (`SettingsModal`)**: Sound effects toggle, cozy background ambience toggle, visual juice effects toggle, fullscreen display toggle, and credits honoring Udupi and Tamil Nadu street food traditions.
- **Top Quick Audio Toggle**: Sound on/off icon with instant audio state persistence.

---

## 📁 Architecture & Directory Structure

```
DOSA HOUSE/
├── public/
│   └── assets/               # High-resolution art illustrations
│       ├── restaurant_bg.jpg # Warm South Indian cafe dining room
│       ├── dosa_platter.jpg  # Golden crispy dosa on banana leaf
│       └── kitchen_station.jpg# First-person tawa cooking station
├── src/
│   ├── audio/
│   │   └── SoundFX.ts        # Web Audio API synthesizer for tactile sounds
│   ├── config/
│   │   ├── theme.ts          # Authentic color palette, fonts, dimensions
│   │   └── gameConfig.ts     # Phaser 3 responsive scale & physics setup
│   ├── scenes/
│   │   ├── BootScene.ts      # Canvas initialization & loader dismiss
│   │   ├── PreloadScene.ts   # Asset loading & themed progress bar
│   │   ├── MainMenuScene.ts  # Main menu centerpiece & interactive UI
│   │   └── GameScene.ts      # Kitchen cooking station architecture stub
│   ├── services/
│   │   ├── AssetGenerator.ts # Procedural canvas generator (wood buttons, kolam, badges, icons)
│   │   └── RecipeRegistry.ts # Recipe catalog, ingredients, and unlock system
│   ├── types/
│   │   └── recipe.ts         # TypeScript definitions for recipes, orders & tawa state
│   ├── ui/
│   │   ├── CozyButton.ts     # Carved wooden button with hover & audio
│   │   ├── RecipeBookModal.ts# Cookware recipe book dialog
│   │   ├── SettingsModal.ts  # Audio & display settings dialog
│   │   └── SteamParticles.ts # Rising steam particle emitter
│   └── main.ts               # Game entry point
├── index.html                # HTML5 responsive wrapper & Google Fonts
├── package.json              # Vite, Phaser 3, TypeScript configuration
├── tsconfig.json             # Strict TypeScript configuration
└── vite.config.ts            # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🍳 Interactive Cooking Mechanics Roadmap
The codebase architecture is primed for the next phase of cooking gameplay:
1. **Batter Ladle Drag & Drop**: Spooning fermented batter onto the heated cast-iron tawa.
2. **Spiral Swirl Gesture**: Using the flat bottom of the ladle to trace expanding concentric circles to form the crepe.
3. **Heat & Oil Management**: Adjusting flame intensity and drizzling desi ghee around lifting edges.
4. **Filling Application**: Scooping yellow potato masala or sprinkling red idli gunpowder podi.
5. **Spatula Flip & Fold**: Swiping the spatula to fold into a classic cone, cylinder, or royal triangle.
6. **Plating & Service**: Garnishing onto fresh plantain leaf with coconut chutney, tomato chutney, and piping hot sambar.
