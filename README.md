# BloodConnect Server

Express and MongoDB API for the BloodConnect donation platform.

## Live URL

Not deployed yet.

## Features

- Better Auth email and password authentication
- JWT protection with httpOnly cookies
- User registration, login, and logout
- Profile management
- Donation request CRUD with status workflow
- Donor search by blood group and location
- Admin user management including block, volunteer, and admin roles
- Stripe funding checkout and payment confirmation
- Contact form API
- Vercel serverless support

## Run Locally

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and add:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
BETTER_AUTH_SECRET=use_at_least_32_random_characters
STRIPE_SECRET_KEY=your_stripe_secret_key
```

The server runs on `http://localhost:5000`.

Use test-mode Stripe keys during development.

## API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/profile/me`
- `PATCH /api/profile/me`
- `GET /api/donation-requests` (public pending list)
- `GET /api/donation-requests/my-requests`
- `GET /api/donation-requests/all` (admin/volunteer)
- `GET /api/donation-requests/:id`
- `PATCH /api/donation-requests/:id`
- `DELETE /api/donation-requests/:id`
- `PATCH /api/donation-requests/:id/status`
- `PATCH /api/donation-requests/:id/donate`
- `GET /api/users/search`
- `GET /api/users` (admin)
- `GET /api/users/stats`
- `PATCH /api/users/:id/block`
- `PATCH /api/users/:id/unblock`
- `PATCH /api/users/:id/make-volunteer`
- `PATCH /api/users/:id/make-admin`
- `GET /api/funds`
- `POST /api/funds/checkout`
- `POST /api/funds/confirm`
- `POST /api/contacts`

To create an admin, update a registered user's role to `admin` in MongoDB Atlas.

## Packages Used

- express
- mongodb
- better-auth
- bcryptjs
- jsonwebtoken
- cookie-parser
- cors
- dotenv

## Deployment

Deploy this repository to Vercel and add all variables from `.env.example`.
Set `CLIENT_URL` to the deployed frontend URL. After deployment, update the
client's `NEXT_PUBLIC_SERVER_URL` with the deployed API URL.
