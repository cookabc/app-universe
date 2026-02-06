<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Event Countdown

Event Countdown is a Vite + React app that recreates a clean, iOS-inspired countdown experience for upcoming and past events. It includes a dashboard with filters, a calendar view, and an add-event flow, all optimized for a mobile-sized layout with dark mode support.

View in AI Studio: https://ai.studio/apps/drive/1aWb57UcmkpaxoBHMIfpr-fH84UQJSJbu

## Highlights

- iOS-style layout, segmented controls, and bottom tab navigation
- Dashboard filters for All, Past, and Future events
- Add Event flow with basic validation and all-day toggle
- Dark mode toggle with local persistence
- Local storage persistence for created events

## Project Structure

- App shell and routing: [App.tsx](./App.tsx), [index.tsx](./index.tsx)
- Feature views: [Dashboard.tsx](./components/Dashboard.tsx), [CalendarView.tsx](./components/CalendarView.tsx), [SettingsView.tsx](./components/SettingsView.tsx), [AddEvent.tsx](./components/AddEvent.tsx)
- UI building blocks: [EventCard.tsx](./components/EventCard.tsx), [CalendarPicker.tsx](./components/CalendarPicker.tsx), [TimePicker.tsx](./components/TimePicker.tsx)
- Mock data and types: [constants.ts](./constants.ts), [types.ts](./types.ts)
- Styling and theme tokens: [index.html](./index.html)

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Build and Preview

1. Build for production:
   `npm run build`
2. Preview the build locally:
   `npm run preview`

## Environment Variables

If you use Gemini integrations, set the key in `.env.local`:

```
GEMINI_API_KEY=your_key_here
```

## Notes

- Events created in the Add Event screen are stored in localStorage, so they persist across refreshes.
- The calendar view is a UI demo and does not yet reflect saved events.
