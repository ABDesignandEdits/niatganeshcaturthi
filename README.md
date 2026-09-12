# MUSHAK DASH GAME
### A Vinayaka Chaturthi Festival Adventure

A complete, polished, and respectful 2D arcade runner game developed for the **Student Game Design Contest** celebrating **Vinayaka Chaturthi / Ganesh Chaturthi**.

---

## 🎮 Game Concept

In **Mushak Dash**, the player guides **Mushak**, Lord Ganesha's devoted, swift, and humble mouse companion (*Vahana*), through vibrant Indian streets during the Ganesh Chaturthi festivities.

Players must help Mushak collect sacred offerings (Modaks, Durva grass, Marigolds, and glowing Diyas), avoid harmless festival obstacles, navigate colorful Rangoli sequences, support eco-friendly traditions, and reach the serene riverfront Visarjan finale with joy and reverence.

---

## 🪔 Contest Theme: Connection to Vinayaka Chaturthi

**Vinayaka Chaturthi** commemorates the arrival of Lord Ganesha to earth from Kailash Parvat. Ganesha represents wisdom, auspicious beginnings, and the removal of obstacles (*Vighnaharta*).

### How Mushak Dash Honors the Festival:
1. **The Role of Mushak**: Mushak is depicted with dignity, agility, and joy, carrying out sacred duties for Lord Ganesha while adorned in traditional festival attire and tilak.
2. **Reverence & Respect**: Lord Ganesha is never placed in danger, attacked, or depicted disrespectfully. He is present as the divine protector and patron at pandals and the sacred Visarjan waterfront.
3. **Sacred Offerings**:
   * **Modaks**: Ganesha's beloved sweet dumpling (+10 pts)
   * **Durva Grass**: 21 sacred shoots of Bermuda grass (+8 pts)
   * **Marigold Flowers**: Golden floral garlands (+5 pts)
   * **Diyas**: Terracotta lamps symbolizing victory of light (+15 pts)
4. **Eco-Friendly Devotion (Stage 4)**: The game actively educates players on the importance of *Shadu Mati* (natural clay) murtis and natural decorations, encouraging celebration that protects rivers and nature.
5. **Visarjan Finale (Stage 5)**: Concludes with the uplifting chant **"Ganpati Bappa Morya!"** alongside traditional Dhol-Tasha rhythms and floating river diyas.

---

## ✨ Key Features

* **5 Progressive Festival Stages**:
  * **Stage 1 — Festival Street**: Morning streets, colorful residential houses, jumping basics.
  * **Stage 2 — The Rangoli Lane**: Memory/sequence mechanic collecting Red → Yellow → Green → Blue colors for massive combos.
  * **Stage 3 — Pandal Festival**: Grand illuminated Sarvajanik Pandal with chandeliers, dhol drums, and rolling carts.
  * **Stage 4 — Eco-Friendly Festival**: Collect biodegradable clay, leaves, and flowers while avoiding plastic litter for a high Eco Score.
  * **Stage 5 — Visarjan Journey**: Sunset riverfront procession with floating diyas, flower showers, and celebration.
* **Combo Multiplier System**: Build consecutive streaks from x2 to x5+ with visual flame badges and rising audio pitches.
* **4 Unique Power-Ups**:
  * **Divine Blessing**: Golden glowing aura rendering Mushak invulnerable.
  * **Modak Magnet**: Automatically pulls nearby offerings toward Mushak.
  * **Festival Boost**: Speed burst and 2x point multiplier.
  * **Flower Trail**: Leaves a blooming trail of marigolds that auto-scores points.
* **Festival Trivia Quiz**: Educational bonus rounds after stages rewarding +100 bonus points.
* **Procedural Indian Festival Audio Synthesizer**: Native Web Audio API implementation synthesizing real-time Dhol beats, temple bells, Manjira chimes, Shankh resonance, and pentatonic ragas completely offline.
* **Local Leaderboard**: Store top 10 player records, eco scores, and nicknames in browser `localStorage`.
* **Responsive Multi-Platform Controls**: Keyboard for desktop and on-screen touch buttons + swipe gestures for mobile and tablets.

---

## ⌨️ Controls

### Desktop:
* **Jump**: `SPACE` / `UP ARROW` / `W`
* **Slide / Duck**: `DOWN ARROW` / `S`
* **Steer**: `LEFT` / `RIGHT ARROWS` / `A` / `D`
* **Pause**: `ESC`

### Mobile & Tablet:
* **Tap screen / Jump Button**: Jump
* **Swipe Down / Slide Button**: Slide
* **On-screen buttons**: Dedicated touch targets for Jump and Slide

---

## 🛠️ Technologies Used

* **HTML5 Canvas API**: High-performance 60 FPS procedural rendering with multi-layer parallax depth.
* **Web Audio API**: Real-time procedural audio synthesis (zero external audio dependencies).
* **React 18+ & TypeScript**: Component-based state architecture and type-safe game logic.
* **Tailwind CSS**: Glassmorphism HUD and responsive layout styling.
* **Lucide Icons**: Crisp vector UI icons.
* **HTML5 LocalStorage**: Persistent high scores and contest leaderboard.

---

## 🚀 How to Run Locally

### Prerequisites:
* Node.js (v18 or higher recommended)
* npm

### Installation:
```bash
# Clone the repository
git clone <repo-url>
cd mushak-dash

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

### Production Build:
```bash
npm run build
npm run preview
```

---

## 👥 Credits

* **Concept & Game Design**: Built for the Vinayaka Chaturthi Student Game Design Contest
* **Art & Animation**: Procedural Canvas vector animations
* **Music & Sound**: Web Audio API festival synthesis
* **Cultural Guidance**: Dedicated to the timeless heritage of Sarvajanik Ganeshotsav

---

## 🔮 Future Improvements

1. Additional festival stages (e.g. Pune/Mumbai Heritage Dhol-Tasha Pathak).
2. Global multi-campus university leaderboard via Firebase Firestore.
3. Customizable festive attire and ornaments for Mushak.
4. Rhythm mini-game to play the Dhol drum along with traditional talam beats.
