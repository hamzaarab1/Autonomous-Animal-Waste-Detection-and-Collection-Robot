# YardSentry App

The user interface for **YardSentry**, the autonomous animal-waste collection robot. It's built with Expo (React Native and TypeScript) and Expo Router, and uses Firebase Authentication for accounts.

Right now we target the **website**. Layouts fill the page on desktop and stack into one column in mobile browsers. The same code can later be built as iOS and Android apps.

## Getting started

### 1. Install

```bash
npm install
```

### 2. Add the Firebase keys

Copy the template and fill it in:

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
| --- | --- |
| `EXPO_PUBLIC_FIREBASE_*` (6 values) | Firebase console → Project settings → Your apps → Web app → SDK setup and configuration → **Config** |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Firebase console → Authentication → Sign-in method → Google → **Web SDK configuration** → Web client ID |

Write each line as plain `KEY=value`, with no quotes. Git ignores `.env.local`. Expo only reads it on startup, so restart the dev server after you change it.

In the Firebase console, **Authentication → Sign-in method → Google** must be enabled. `localhost` is an authorized domain by default.

### 3. Run

```bash
npm run web       # website at http://localhost:8081
npm start         # dev server; press w (web), a (Android), or i (iOS)
npm run lint
npx tsc --noEmit  # type check
```

## How it works

### Pages

| URL | Screen | Who can see it |
| --- | --- | --- |
| `/` | Landing page | Everyone |
| `/login`, `/login?mode=signup` | Log in / sign up | Signed-out users (signed-in users are sent to `/dashboard`) |
| `/dashboard` | Overview: stats, robot cards, recent activity | Signed-in users |
| `/robots` | All paired robots | Signed-in users |
| `/schedule` | Scheduled cleans | Signed-in users |
| `/history` | Detection history | Signed-in users |
| `/settings` | Account info, sign out | Signed-in users |

Every screen in `src/app/(app)/` requires sign-in. Its `_layout.tsx` redirects signed-out users to `/login` and wraps each page in the dashboard frame. On desktop that's a sidebar, on tablets an icon-only sidebar, and on phones a top bar with bottom tabs.

### Sign-in

- **Google:** On web, sign-in opens a Firebase popup. On iOS/Android it opens the native Google account picker, then signs into Firebase. Both are in `src/lib/google-sign-in.ts` (web) and `google-sign-in.native.ts` (native). Expo picks the right file for each platform.
- **Email/password:** the form is built but **not connected yet**.
- `src/lib/auth-context.tsx` provides `useAuth()`, which returns `{ user, initializing, signOut }` anywhere in the app.
- Accounts show up in the Firebase console under **Authentication → Users**.

### Sample data

The dashboard currently shows **made-up robots, schedules, and detections**. Every dashboard page has a yellow "Sample data" tag to show this. All of it lives in `src/lib/robots.ts`. When the app can talk to a real robot, replace the `useRobots()`, `useSchedules()`, and `useDetections()` hooks there; the pages only depend on those hooks and types. Then set `USING_SAMPLE_DATA` to `false`.

Buttons like **Start clean**, **Pair a robot**, and **New schedule** show a "coming soon" message for now.

## Project structure

```
src/
  app/                      Screens (Expo Router: file name = URL)
    _layout.tsx             Root layout, wraps the app in <AuthProvider>
    index.tsx               Landing page
    login.tsx               Log in / sign up
    (app)/                  Signed-in area (folder name in parentheses is not part of the URL)
      _layout.tsx           Auth check + dashboard frame
      dashboard.tsx  robots.tsx  schedule.tsx  history.tsx  settings.tsx
  components/
    button.tsx              Primary / secondary / ghost button, optional icon
    grid.tsx                Equal-width column grid (pass columns per screen size)
    yardsentry-logo.tsx     Wordmark and shield mark
    yard-illustration.tsx   Landing page illustration
    dashboard/
      app-shell.tsx         Sidebar / tab bar, nav items, avatar
      ui.tsx                Page, PageHeader, Card, StatTile, StatusPill, Meter, EmptyState
      robot-card.tsx        One robot's status, battery, bin, actions
      detection-row.tsx     One row in the activity / history lists
  constants/theme.ts        Colors, spacing, radii, page width, breakpoints
  hooks/use-layout.ts       isPhone / isTablet / isDesktop and page padding from window width
  lib/
    firebase-config.ts      Reads the EXPO_PUBLIC_* keys
    firebase.ts             Firebase setup (web); firebase.native.ts for iOS/Android
    google-sign-in.ts       Google sign-in / sign-out (web); .native.ts for iOS/Android
    auth-context.tsx        useAuth()
    robots.ts               Robot data types and SAMPLE data hooks
    notify.ts               Popup messages (works on web, unlike React Native's Alert)
assets/                     App icon, favicon, splash, Android/iOS icons
```

### Common changes

- **Add a dashboard page:** create `src/app/(app)/<name>.tsx` using `<Page>` and `<PageHeader>` from `components/dashboard/ui.tsx`, then add it to the `NAV` list in `components/dashboard/app-shell.tsx`.
- **Responsive layouts:** use `useLayout()` and switch on `isPhone` / `isTablet` (≥ 700px) / `isDesktop` (≥ 1024px), for example `<Grid columns={isDesktop ? 3 : 1}>`.
- **Colors and spacing:** use the tokens in `constants/theme.ts` rather than hard-coded values.
- **Popups:** use `notify(title, message)` from `lib/notify.ts`. React Native's `Alert` does nothing on web.

## iOS and Android (later)

The phone apps need a **development build**. Google sign-in does not work in Expo Go. Before building:

1. In Firebase, add an **Android app** with package `com.yardsentry.app` and your SHA-1 fingerprint (`npx expo prebuild`, then `cd android && ./gradlew signingReport`).
2. In Firebase, add an **iOS app** with bundle ID `com.yardsentry.app`. Copy `REVERSED_CLIENT_ID` from its `GoogleService-Info.plist` over the `REPLACE_WITH_IOS_CLIENT_ID` placeholder in `app.json`.
3. Build with `npx expo run:android` / `npx expo run:ios`, or `eas build --profile development`.
