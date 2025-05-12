# 📚 Course Connect

**Course Connect** is a Progressive Web Application (PWA) created for undergraduate students at Technological University Dublin, Blanchardstown. It unifies course-based task planning, real-time collaboration, offline-first support, and gamified study tracking within a sleek, responsive interface.

---

## 📑 Table of Contents

1. [Introduction](#introduction)
2. [Live Demo & Documentation](#live-demo--documentation)
3. [Key Features](#key-features)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [Performance & Quality Assurance](#performance--quality-assurance)
7. [Installation & Local Development](#installation--local-development)
8. [Deployment](#deployment)
9. [Contributors](#contributors)
10. [Roadmap](#roadmap)
11. [License](#license)

---

## Introduction

Course Connect is a fast, installable PWA tailored to support student life at TU Dublin Blanchardstown. By consolidating calendars, task managers and communication tools into a single platform, it empowers students to stay organised, collaborate effectively and maintain motivation throughout their studies.

## Live Demo & Documentation

- 🔗 **Live Application**: [https://course-connect.app](https://course-connect.app)
- 📘 **Full Thesis**: [Overleaf Project](https://www.overleaf.com/project/67992d440bc6b4c1ec373123)

---

## Key Features

1. **Course-Aware Task Management**  
   Create, prioritise and organise tasks by course or module, utilising drag‑and‑drop, due‑date reminders and progress indicators.

2. **Study Buddy Collaboration**  
   Real-time chat, nudges and shared task lists enable peer accountability and instant feedback.

3. **Timetable Planner**  
   Manually build and visualise weekly schedules, with clash detection and customisable time slots.

4. **Focus Timer & Flashcards**  
   Employ the Pomodoro‑style focus timer and flashcard toolset to structure study sessions and reinforce learning.

5. **Gamification & Analytics**  
   Earn coins, unlock badges and track streaks via an analytics dashboard that promotes consistent study habits.

6. **Notifications & Reminders**  
   Receive in-app alerts (via Sonner) and optional SMS notifications (via Twilio) for upcoming deadlines.

7. **Offline Functionality**  
   Continue working without an internet connection; data is cached locally and synchronised automatically when you reconnect.

---

## Technology Stack

### Frontend
- React 18 & TypeScript
- Vite for rapid development and bundling
- Tailwind CSS for utility‑first styling
- Framer Motion for fluid animations

### Backend & Database
- Supabase (PostgreSQL, Realtime, Auth, Storage)
- Row‑Level Security (RLS) for robust access control
- Custom SQL functions for triggers, gamification logic and data validation

### DevOps & CI/CD
- Vercel for PWA hosting and global CDN delivery
- GitHub Actions for continuous integration: linting, testing and preview deployments

---

## Project Structure

```text
├── public/                 # Static assets (icons, images)
├── src/                    # Application source code
│   ├── components/         # Reusable UI components
│   ├── pages/              # Route-level pages (Tasks, Study, Profile, etc.)
│   └── lib/                # Supabase client, helper functions
├── supabase/               # Database schema, policies, edge functions
├── .env.example            # Environment variable template
├── tailwind.config.ts      # Tailwind CSS configuration
├── vite.config.ts          # Vite build configuration
└── README.md               # Project overview (this file)
```

---

## Performance & Quality Assurance

- **Jest & React Testing Library** for unit and integration testing
- **Playwright** for end-to-end test scenarios
- **Lighthouse CI Metrics**:

---

## Installation & Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/course-connect.git
   cd course-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with Supabase credentials
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

Access the development server at `http://localhost:0000`.

---

## Deployment

Push changes to the `main` branch on GitHub; Vercel will handle build and deployment automatically.

---

## Contributors

- **Ian Mugo** – Product Owner, Frontend & UI/UX Lead
- **Dylan Mugo** – Frontend Engineer (Timetable & Flashcards)
- **Daniel Ikomi** – Backend Engineer (Supabase & Realtime Services)

---

## Roadmap

- OAuth & SSO integration (Google, GitHub, Microsoft, TU Dublin SSO)
- Bulk import/export of timetables (CSV & API)
- Document versioning & inline previews
- Shared whiteboards with real‑time co‑editing
- Enhanced leaderboards & social features
- Accessibility audit and improvements

---

## License

This repository is licensed for academic and personal use. For commercial licensing or partnership enquiries, please contact the authors directly.
