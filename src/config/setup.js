import { createIndexes } from "../../database/indexes.js";
import { migrateOldUsers } from "../modules/auth/auth.service.js";
import { connectDB } from "./db.js";
import { env } from "./env.js";

let setupPromise;

export function setupServer() {
  if (setupPromise) {
    return setupPromise;
  }

  if (!env.jwtSecret || !env.betterAuthSecret) {
    throw new Error("JWT_SECRET or BETTER_AUTH_SECRET is missing in .env");
  }

  setupPromise = (async () => {
    await connectDB();
    await migrateOldUsers();
    await createIndexes();
  })();

  setupPromise.catch(() => {
    setupPromise = null;
  });

  return setupPromise;
}
