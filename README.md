# Urlaub gegen Hand

A community-driven platform connecting Hosts and Helpers for unique travel experiences. This guide explains how to install, run, and use the application.

## Prerequisites

- Node.js (v16+)
- npm (v8+) or Yarn

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/urlaub-gegen-hand.git
   cd urlaub-gegen-hand
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

## Running the App Locally

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open your browser at `http://localhost:3000` to view the app.

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file in the project root and add any necessary keys. For example:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
# Add other keys as needed
```

## User Flow and Features

### 1. Sign Up & Authentication

- **Register** as a Host or Helper using email/password.
- **Log in** to access your dashboard.

### 2. Host Dashboard

Navigate to **Dashboard** → **Host** after login.

- **Listing Management**: Create, edit, activate/deactivate, and delete property listings.
- **Requests**: View incoming booking requests, accept or reject, and manage booking status.
- **Overview Widgets**:
  - **Stats Cards**: See total listings, active/inactive counts, and trends.
  - **Activity Feed**: View recent actions on your account.
  - **Calendar**: Preview upcoming stays.
- **Notifications**: Click the bell icon in the navbar to see real-time alerts.

#### Routes

- `/dashboard/host/listings`
- `/dashboard/host/requests`

### 3. Helper Dashboard

Navigate to **Dashboard** → **Helper** after login.

- **Search Listings**: Discover host listings by location, date, and category.
- **Applications**: Track your booking requests (pending, confirmed, completed).
- **Overview Widgets**:
  - **Stats Cards**: See application counts and status breakdowns.
  - **Activity Feed**: Recent actions related to your applications.
  - **Calendar**: View confirmed stays you booked.
- **Notifications**: In-app alerts for new updates.
- **Quick Actions**: Apply to listings or message hosts directly.

#### Routes

- `/dashboard/helper/requests`

### 4. Messaging System

- Access **Messages** from the main navigation.
- View conversation threads and send/receive messages in real time.
- Use the **Compose** area to write and send new messages.

### 5. Booking & Requests

- **Helpers** can send booking requests from a listing page.
- **Hosts** manage requests on their dashboard with accept/reject workflows.
- Confirmations and cancellations trigger notifications for both parties.

### 6. Reviews

- After a stay completes, both Hosts and Helpers are prompted to leave reviews.
- Reviews include star ratings, comments, and appear on user profiles.
- View aggregated ratings on profile pages.

## Mock Data & Services

For development, the app uses in-memory mock data services with localStorage persistence. Check out:

- `src/mocks/services.ts` — CRUD functions for Listings, Users, Bookings, etc.
- `src/mocks/notifications.ts` — Sample notifications.
- `src/mocks/activities.ts` — Sample activity feed events.

## Tech Stack

- Next.js 15 (App Router)
- React & TypeScript
- Tailwind CSS
- Zustand / React Context for state
- `react-day-picker` for calendar
- `framer-motion` for animations
- Shadcn UI (Radix + Tailwind)
- LocalStorage-based mock API

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: Add ..."`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
