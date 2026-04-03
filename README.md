# Habit Tracker — Frontend

A React/Vite single-page application for tracking daily habits. Features a notebook-themed two-page layout with habit tracking, statistics, and user profile management.

## Tech Stack

- React 18
- Vite
- CSS (scoped per component)

## Project Structure
```
src/
├── App.jsx                  # Root component, global state, page routing
├── App.css                  # Notebook layout, page structure
├── index.css                # Base styles
├── main.jsx                 # Entry point
│
├── Components/
│   ├── AtAGlance.jsx        # Weekly/monthly habit summary view
│   ├── Calendar.jsx         # Date picker
│   ├── CreateEditHabitModal.jsx  # Create and edit habit modal
│   ├── CustomRecurrenceModal.jsx # Custom recurrence schedule picker
│   ├── DeleteAccountModal.jsx    # Account deletion confirmation modal
│   ├── Habit.jsx            # Individual habit row wrapper
│   ├── HabitsPage.jsx       # Daily habits list and completion tracking
│   ├── Navbar.jsx           # Top navigation bar
│   ├── ResetPasswordModal.jsx    # Password reset modal
│   ├── Settings.jsx         # User settings page
│   ├── Stats.jsx            # Habit statistics page
│   ├── UserInfoUpdate.jsx   # Profile info update form
│   │
│   ├── Habits/              # Habit type components
│   │   ├── CheckboxHabit.jsx
│   │   ├── CounterHabit.jsx
│   │   ├── DurationHabit.jsx
│   │   └── SliderHabit.jsx
│   │
│   ├── HomePage/
│   │   ├── Home.jsx         # Landing page (logged out)
│   │   └── Info.jsx         # App info page
│   │
│   ├── Login/
│   │   ├── LoginMenu.jsx    # Login form
│   │   └── SignUpMenu.jsx   # Sign up form
│   │
│   └── Profile/
│       ├── ProfileLeft.jsx  # Left page profile wrapper
│       └── ProfileRight.jsx # Right page settings wrapper
│
├── Helpers/                 # API call functions
│   ├── CompletionHelper.js  # Completion CRUD
│   ├── HabitHelper.js       # Habit CRUD and data mapping
│   ├── SettingsHelper.js    # Settings load and update
│   └── UserHelper.js        # User CRUD, auth, password reset
│
└── Style/                   # Per-component CSS files
```

## Pages

The app uses a two-column notebook layout. Each side renders one page at a time controlled by `leftPageView` and `rightPageView` state in `App.jsx`.

| View Key | Component | Side |
|---|---|---|
| `Home` | `Home` | Left |
| `Habits` | `HabitsPage` | Left |
| `Login` | `LoginMenu` | Left |
| `Profile` | `ProfileLeft` | Left |
| `Info` | `Info` | Right |
| `Stats` | `Stats` | Right |
| `Glance` | `AtAGlance` | Right |
| `SignUp` | `SignUpMenu` | Right |
| `Profile` | `ProfileRight` | Right |

## Global State (App.jsx)

| State | Description |
|---|---|
| `user` | Logged in user object |
| `leftPageView` / `rightPageView` | Current page on each side |
| `selectedDate` | Date selected in the calendar |
| `displayMode` | Light or dark mode setting |
| `leftDefaultPage` / `rightDefaultPage` | Default pages on login |
| `defaultHabitType` | Default type in habit creation modal |

## Getting Started
```bash
npm install
npm run dev
```

Set `VITE_BACKEND_BASE_URL` in a `.env` file:
```
VITE_BACKEND_BASE_URL=http://localhost:3000
```