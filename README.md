# SpeakX — Beginner Learning Flow

A confidence-first, real-life conversation learning experience for **absolute beginners** (users who know zero English). It reframes the old vocabulary-based lesson into *"learn exactly what to say in real life."*

> Improvement of the existing SpeakX app — same branding, colors, typography, header, bottom nav, premium banner, coins, card and button styling, and spacing. Only the learning flow changes.

## The flow

**Screen 1 — Home**
- Lesson card reworded: `Vocabulary` → **Aaj ke Sentences**, subtitle **"Video dekho aur 3 baatein bolna seekho"**.
- Start now opens the situation lesson (not vocabulary).

**Screen 2 — Situation Learning (Kirana Shop)**
- Top media (~38% height) — situation video.
- `Aaj hum seekhenge` → 🛒 *Shopkeeper se English mein baat karna*.
- `Progress: x/3 Complete` with an orange bar.
- Exactly 3 clean task cards (icon + title + chevron only):
  - 👋 Shopkeeper ko greet karo
  - 💰 Price pucho
  - 💳 Payment karo

## Run

```bash
cd speakx_beginner_flow
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

```
speakx_beginner_flow/
├── index.html
├── css/styles.css            # design tokens mirror the existing app
├── js/app.js                 # router (Start → Situation; task → placeholder)
├── js/components.js          # shared header / nav / banner / toast
├── js/data/situations.js     # every situation as pure data (extensible)
├── js/screens/home.js
├── js/screens/situation.js
└── assets/kirana_training_video.mp4
```

## Extending

- **New situations** (Restaurant, Metro, Office, Interview, Doctor, Customer Service, Delivery, Friends & Family): add one object to `js/data/situations.js` — screen code never changes. A commented scaffold is included.
- **New lesson types** per task (`video`, `speaking`, `readAlong`, `rolePlay`, `aiCall`): each task carries a `modules` array; route to real screens from the single tap handler in `js/app.js`.
