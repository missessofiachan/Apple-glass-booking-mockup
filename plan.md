# Melbourne Multicultural Festival Booking Mockup - Implementation Plan

We are building a premium, state-of-the-art Eventbrite-style booking web application for exclusive Melbourne multicultural celebration events (community workshops, cultural showcases, and food festivals).

## Technical Architecture
- **Framework**: Vite + React + TypeScript
- **Styling**: Vanilla CSS (sleek dark mode, glassmorphism, glowing HSL color tokens, rich keyframe animations)
- **Features**:
  - Immersive Hero header with real-time particle/mesh-style canvas background.
  - Interactive Filter System (Demos, Labs, Workshops, Keynotes).
  - Rich Interactive Event Cards showing dynamic availability and duration tags.
  - Interactive Seat & Time Slot Selector Modal (includes interactive physical seat-grid simulator).
  - Dynamic digital flip ticket/pass with SVG custom QR codes, confirmation animations, and confetti effects.
  - My Tickets management drawer to view, track, and securely cancel mock reservations.

## Security Controls (Secure Web Frontend)
- No unsafe DOM insertions (strict use of JSX framework-native escaping).
- Simulated dynamic PII masking for any user-entered confirmation details (e.g. `jo***@domain.com`).
- No native block dialogs (`alert()`, `confirm()`); custom elegant glassmorphic modal components only.
