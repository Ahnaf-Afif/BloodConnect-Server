# BloodConnect Server

BloodConnect Server is the Express and MongoDB API for the BloodConnect blood
donation platform. It provides authentication, role-based access, donation
request management, donor search, user administration, and Stripe funding.

## Live API

- API: https://bloodconnect-server-afif.vercel.app
- Health check: https://bloodconnect-server-afif.vercel.app/health
- Client application: https://bloodconnect-client-afif.vercel.app
- Server repository: https://github.com/Ahnaf-Afif/BloodConnect-Server
- Client repository: https://github.com/Ahnaf-Afif/BloodConnect-Client

## Core Features

- Better Auth email and password accounts
- JWT protection through HTTP-only cookies or bearer tokens
- Current-role and blocked-status checks on protected requests
- Donor, volunteer, and admin authorization
- Profile viewing and editing
- Donation request CRUD, filtering, pagination, and status updates
- Atomic donation confirmation to prevent duplicate donors
- Donor search by blood group and Bangladesh location
- Admin user blocking and role management
- Dashboard statistics and funding totals
- Stripe Checkout creation and payment confirmation
- Contact message storage
- MongoDB indexes and serverless-safe database initialization

## Role Permissions

| Role | Permissions |
| --- | --- |
| Donor | Create requests, manage owned requests, donate, search, fund, and edit profile |
| Volunteer | Create requests, view all requests, update request status, and view statistics |
| Admin | Manage all requests and users, assign roles, block users, and view statistics |

## Technology

| Area | Package |
| --- | --- |
| Server | Express 5 |
| Database | MongoDB native driver |
| Authentication | Better Auth, bcryptjs |
| API protection | jsonwebtoken, cookie-parser |
| Payments | Stripe REST API |
| Cross-origin access | cors |
| Configuration | dotenv |
| Deployment | Vercel serverless functions |

## Local Setup

### Requirements

- Node.js 20 or newer
- A MongoDB Atlas database
- A Stripe test-mode secret key

### Installation

```bash
git clone https://github.com/Ahnaf-Afif/BloodConnect-Server.git
cd BloodConnect-Server
npm install
cp .env.example .env
npm run dev
```

The API will run at `http://localhost:5000`.

### Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Local server port; defaults to `5000` |
| `CLIENT_URL` | Yes | Allowed frontend origin and Stripe return URL |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `JWT_SECRET` | Yes | Secret used to sign API tokens |
| `BETTER_AUTH_SECRET` | Yes | Better Auth secret with at least 32 characters |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key; use a test key locally |

Never commit the `.env` file.

## API Reference

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register a donor account |
| `POST` | `/api/auth/login` | Public | Log in and receive the JWT cookie/token |
| `POST` | `/api/auth/logout` | Public | Clear the authentication cookie |
| `GET` | `/api/auth/me` | Private | Return the current authenticated user |

### Profiles

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/profile/me` | Private | Get the current profile |
| `PATCH` | `/api/profile/me` | Private | Update the current profile |

### Donation Requests

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/donation-requests` | Public | List pending requests |
| `POST` | `/api/donation-requests` | Private | Create a request |
| `GET` | `/api/donation-requests/my-requests` | Donor | List owned requests |
| `GET` | `/api/donation-requests/all` | Admin, Volunteer | List all requests |
| `GET` | `/api/donation-requests/:id` | Private | Get request details |
| `PATCH` | `/api/donation-requests/:id` | Donor owner, Admin | Edit a request |
| `DELETE` | `/api/donation-requests/:id` | Donor owner, Admin | Delete a request |
| `PATCH` | `/api/donation-requests/:id/status` | Owner, Admin, Volunteer | Update request status |
| `PATCH` | `/api/donation-requests/:id/donate` | Private | Confirm as donor |

### Users and Statistics

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/users/search` | Public | Search active donors |
| `GET` | `/api/users` | Admin | List and filter users |
| `GET` | `/api/users/stats` | Admin, Volunteer | Get dashboard statistics |
| `PATCH` | `/api/users/:id/block` | Admin | Block a user |
| `PATCH` | `/api/users/:id/unblock` | Admin | Unblock a user |
| `PATCH` | `/api/users/:id/make-volunteer` | Admin | Assign volunteer role |
| `PATCH` | `/api/users/:id/make-admin` | Admin | Assign admin role |

### Funding and Contact

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/funds` | Private | List successful funds |
| `POST` | `/api/funds/checkout` | Private | Create Stripe Checkout |
| `POST` | `/api/funds/confirm` | Private | Verify and save payment |
| `POST` | `/api/contacts` | Public | Save a contact message |

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with Node watch mode |
| `npm start` | Start the production Node server |

## Project Structure

```text
database/             MongoDB collections and indexes
src/config/           Environment, database, auth, and startup configuration
src/middlewares/      JWT and role checks
src/modules/          Authentication, profiles, and donation requests
src/routes/           Users, funds, and contact routes
src/utils/            Pagination and JWT helpers
```

## Deployment

The API is deployed on Vercel using `vercel.json`. Add every variable from
`.env.example` to the production project. Set `CLIENT_URL` to the exact deployed
frontend origin so browser credentials, CORS, and Stripe redirects work
correctly.
