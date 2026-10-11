# YardSentry: Autonomous Animal Waste Detection and Collection Robot

Capstone project (OSS 4900). YardSentry is an outdoor robot that finds and picks up animal waste in a backyard or cottage yard and stores it onboard. The user teaches it a boundary, then starts a clean or sets a schedule.

## Repository layout

| Folder | What's in it |
| --- | --- |
| [`mobile/`](mobile/) | The YardSentry app: a website for now, with phone apps planned. It has the landing page, login (Google via Firebase), and the user dashboard. See [mobile/README.md](mobile/README.md). |

## Quick start (website)

```bash
cd mobile
npm install
cp .env.example .env.local   # then fill in the Firebase keys (see mobile/README.md)
npm run web                  # opens http://localhost:8081
```

## Status

- [x] Landing page
- [x] Login page with Google sign-in (Firebase Authentication)
- [x] Dashboard framework: Overview, Robots, Schedule, History, Settings
- [x] Responsive layout for desktop and mobile browsers
- [x] YardSentry branding (logo, app icon, favicon)
- [ ] Email/password sign-in (form exists, not yet connected to Firebase)
- [ ] Robot connection: the dashboard shows **sample data** until the app can talk to a robot
- [ ] Robot pairing (QR code), boundary teaching, manual drive, schedules
- [ ] iOS/Android builds
