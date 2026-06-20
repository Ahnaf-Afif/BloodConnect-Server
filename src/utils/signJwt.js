import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export function signJwt(user) {
  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is missing in .env");
  }

  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: "7d" }
  );
}
