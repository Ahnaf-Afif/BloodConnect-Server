# BloodConnect Server

Backend API for the BloodConnect donation platform.

## Live URL

Add your deployed API URL here.

## Features

- JWT authentication with httpOnly cookies
- User registration, login, and logout
- Profile management
- Donation request CRUD with status workflow
- Donor search by blood group and location
- Admin user management including block, volunteer, and admin roles
- Funding checkout and confirmation flow
- Contact form API

## Run Locally

```bash
npm install
npm run dev
```

Create a `.env` file:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

The server runs on `http://localhost:5000`.

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
- `GET /api/funds`
- `POST /api/funds/checkout`
- `POST /api/funds/confirm`
- `POST /api/contacts`

To create an admin, update a registered user's role to `admin` in MongoDB Atlas.

## Packages Used

- express
- mongodb
- bcryptjs
- jsonwebtoken
- cookie-parser
- cors
- dotenv
