# YardSentry Mobile

User interface for **YardSentry**, the autonomous animal-waste collection robot, built with Expo (React Native + TypeScript) and Expo Router.

## Run

```bash
npm install
npx expo start      # then press a (Android), i (iOS), or w (web); or scan the QR code with Expo Go
```

## Structure

- `src/app/` – screens (Expo Router): `index.tsx` landing page, `login.tsx` log in / sign up (`/login?mode=signup`)
- `src/components/` – `yardsentry-logo.tsx` (wordmark + shield mark), `button.tsx`, `yard-illustration.tsx`
- `src/constants/theme.ts` – brand colors, spacing, radii
