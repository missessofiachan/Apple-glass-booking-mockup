# 🌸 Melbourne Multicultural Festival Booking Platform

A premium, state-of-the-art **glassmorphic event booking mockup platform** built for Melbourne's iconic multicultural celebrations (Carlton Italian Festa, Greek Lonsdale Precinct, Chinatown Lunar New Year, Federation Square Diwali Lights, and Johnston St Fitzroy Fiesta). 

Designed with meticulous Apple-inspired glassmorphic aesthetics—frosted overlays, harmonized HSL sage-green/mint/coral color palettes, tactile micro-animations, and 3D card-flip perspectives.

---

## ✨ Core Features

### 📅 Tactile Month Calendar & Filter
* **Interactive June 2026 Widget**: A custom-designed desktop calendar displaying glowing, color-coded indicator dots on dates hosting active festivals.
* **Instant Filter Mechanics**: Click any date to automatically filter the live multicultural event listings with smooth fade transitions.

### 🌤️ Smart Weather Integration (Open-Meteo API)
* **Live Today Forecasts**: If a booked event matches the current calendar day, the platform queries the Open-Meteo Forecast API (`/v1/forecast`) to fetch real-time atmospheric data, displaying it with a glowing `Live Today` badge.
* **Historical Archive Queries**: For past or future dates, the system queries the **Open-Meteo Historical Archive API** (`/v1/archive`) to supply genuine historical averages. 
* **Smart Future Mocking**: Future mock dates (June 2026) automatically resolve to the corresponding day in the previous year (2025) to provide accurate historical weather patterns.

### 🧁 Dynamic Cultural Add-On Customizer
* **Authentic Upgrades**: When initiating a reservation, attendees can customize their spatial tickets with hand-picked upgrades unique to the festival's heritage (e.g., Carlton Cannoli packs, Fitzroy Spanish Tapas, Federation Square Rangoli clay Diyas).
* **Live Calculations**: Selections dynamically update sub-totals, fee breakdowns, and final AUD total pricing in a structured glass card ledger.

### 🎫 Deluxe Pass Wallet & Tactile Check-In
* **Frosted Wallet drawer**: Organizes active reservations inside a slide-out "My Spatial Keys" side-drawer.
* **3D Perspective Flipping**: Click any digital pass to flip it smoothly using modern 3D CSS perspectives to reveal check-in credentials and authorization codes.
* **Entrance Validation Hologram**: Authorizing check-in on the back of the pass dynamically triggers an animated, glowing neon **"VALIDATED / CHECKED IN"** stamp watermark overlaid across the front QR code matrix.
* **High-Fidelity Text Exports**: Export individual confirmed tickets as printable `.txt` receipts containing validation stamps, weather forecasts, and itemized upgrades.

### 🛠️ Administrative Control Console
* **Role Switcher**: Click the tactile toggle in the header to switch roles seamlessly between **Attendee View** and **Admin View**.
* **Mock Event Publisher Form**: Publish custom June 2026 festivals (which automatically map glowing dots onto the active mini-calendar!).
* **Stateful Deletion Controls**: Remove event listings dynamically to free up calendar allocations and update active list statistics.
* **Full-Featured Editing Console**: Click "Edit" to load an event's parameters into the admin form, switching the canvas color scheme to a dedicated editing console. Save updates or cancel edits on-the-fly.

---

## 🎨 Premium Design System

* **Vanilla CSS Integration**: The entire platform relies on pure, customized Vanilla CSS (`src/index.css`) utilizing HSL custom variables—retaining maximum performance and clean styling rules without using TailwindCSS.
* **Typographical Excellence**: Employs clean, high-readability Google Fonts (`Outfit` and `Inter`) for a highly polished, human-centered UI structure.
* **Safe Terminal Characters**: Strictly avoids complex unicode rendering sets to prevent console and terminal encoding blocks on user systems.

---

## 🚀 Building & Running

Since this project resides on immutable Bazzite Linux distributions, all compilation and development loops are securely ran inside the pre-configured sandbox container.

### Sandbox Build Command
To compile the production bundles cleanly using TypeScript checks:
```bash
toolbox run -c uzdoom-rawhide npm run build
```

### Local Dev Server
To launch the Vite development hot-reload server:
```bash
toolbox run -c uzdoom-rawhide npm run dev
```
