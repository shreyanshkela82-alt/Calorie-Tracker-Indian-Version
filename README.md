# Indian Calorie Tracker

A full-stack calorie and fitness tracking app with an Indian food database,
BMI/BMR-based calorie targets, meal logging, workout tracking, and daily
progress visualization.

## Tech Stack

- **Backend:** Node.js, Express 5, MongoDB (Mongoose), JWT auth, bcrypt
- **Frontend:** Vanilla HTML/CSS/JavaScript

## Project Structure

```
Backend/
  config/db.js              MongoDB connection
  controllers/               Route handler logic
  middleware/
    authMiddleware.js        JWT auth guard
    errorMiddleware.js       Centralized error handling + 404s
    rateLimiter.js           Brute-force protection for auth routes
    validators.js            Request body validation
  models/                    Mongoose schemas (User, Meal, Workout, Progress)
  routes/                    Express routers
  utils/
    asyncHandler.js          Wraps async routes, forwards errors to next()
    ApiError.js              Custom error class with HTTP status codes
    calorieCalculator.js     BMR/TDEE calculation (Mifflin-St Jeor equation)
    progressSync.js          Keeps daily Progress in sync with meals/workouts
  server.js                  App entry point

Frontend/
  loginpage.html/js, register.html/js   Auth
  dashboard.html/js                     Meal logging + calorie summary
  profile.html/js                       User stats, BMI/calorie preview
  workout.html/js                       Guided workout timer, logs to backend
  progress.html/js                      Progress history/charts
```

## Setup

### Backend

```bash
cd Backend
npm install
cp .env.example .env   # then fill in your own values
npm run dev             # nodemon, auto-restarts on changes
# or
npm start
```

Make sure MongoDB is running locally (or point `MONGO_URI` at Atlas).

Server runs at `http://localhost:5000`. Health check: `GET /api/health`.

### Frontend

Just open `Frontend/loginpage.html` in a browser (or serve the folder with
any static file server, e.g. VS Code's Live Server). It talks to the backend
at `http://localhost:5000/api`.

## API Overview

All protected routes require `Authorization: Bearer <token>`.

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account, returns JWT |
| POST | `/api/auth/login` | Log in, returns JWT |
| GET | `/api/profile` | Get current user's profile 🔒 |
| PUT | `/api/profile` | Update profile — server calculates BMI + daily calorie target 🔒 |
| GET | `/api/meals?date=YYYY-MM-DD` | List meals (optionally by date) 🔒 |
| POST | `/api/meals` | Log a meal 🔒 |
| DELETE | `/api/meals/:id` | Delete a meal 🔒 |
| GET | `/api/workouts?date=YYYY-MM-DD` | List workouts (optionally by date) 🔒 |
| POST | `/api/workouts` | Log a workout 🔒 |
| DELETE | `/api/workouts/:id` | Delete a workout 🔒 |
| GET | `/api/progress?from=&to=` | Get progress history (optional date range) 🔒 |
| POST | `/api/progress` | Refresh today's progress snapshot 🔒 |
| DELETE | `/api/progress/:id` | Delete a progress record 🔒 |

## Notable Design Decisions

- **Daily calorie targets are calculated server-side** using the
  Mifflin-St Jeor BMR equation, rather than trusting a client-submitted
  number — keeps the value tamper-proof and consistent.
- **Progress is derived, not manually entered.** `caloriesConsumed` and
  `caloriesBurned` are recomputed from actual Meal/Workout records any time
  one is added or removed, so they can never drift out of sync.
- **Centralized error handling** via a custom `ApiError` class and
  `asyncHandler` wrapper keeps controllers free of repetitive try/catch
  blocks and ensures consistent error response shapes.

## Known Limitations / Next Steps

- No automated test suite yet (would be a good next addition — Jest +
  Supertest for the API, with `mongodb-memory-server` for isolated DB tests).
- No password reset / email verification flow.
- Rate limiting is in-memory per server instance; a multi-instance deployment
  would want a shared store (e.g. Redis) for `express-rate-limit`.
