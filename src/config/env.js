import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  betterAuthSecret: process.env.BETTER_AUTH_SECRET,
  stripeSecret: process.env.STRIPE_SECRET_KEY,
  nodeEnv: process.env.NODE_ENV || "development",
};
