 HEAD
# Expense Tracker MERN

A full-stack expense tracking system with:

- User panel: register, login, forgot/reset password, income/expense/category management, dashboard table, charts.
- Admin panel: login, users list, user editing, high-level analytics.
- MongoDB persistence for users, categories, transactions, and password reset tokens.

## Project Structure

```text
Expense_tracer/
  client/
  server/
```

## Backend Setup

1. Go to `server`
2. Copy `.env.example` to `.env`
3. Fill MongoDB, JWT, and optional email credentials
4. Install dependencies with `npm install`
5. Run with `npm run dev`

## Frontend Setup

1. Go to `client`
2. Install dependencies with `npm install`
3. Create `.env` if needed:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Run with `npm run dev`

## Notes

- Password reset uses email if SMTP variables are configured.
- Without SMTP credentials, the reset link is logged in the backend console for development use.
- The dashboard shows existing transactions immediately and updates after each new income/expense entry.

# expense_tracking
MERN Expense Tracker
 1b96a221d951e1f70011dad0efa2c5f8f6864e69
