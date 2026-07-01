import bcrypt from "bcryptjs";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

import { getDB } from "./db.js";
import { env } from "./env.js";
import { roles } from "../constants/roles.js";

let auth;

export function getAuth() {
  if (auth) {
    return auth;
  }

  if (!env.betterAuthSecret) {
    throw new Error("BETTER_AUTH_SECRET is missing in .env");
  }

  auth = betterAuth({
    database: mongodbAdapter(getDB()),
    secret: env.betterAuthSecret,
    baseURL: `http://localhost:${env.port}`,
    trustedOrigins: [env.clientUrl],
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
      minPasswordLength: 6,
      password: {
        hash: (password) => bcrypt.hash(password, 10),
        verify: ({ hash, password }) => bcrypt.compare(password, hash),
      },
    },
    user: {
      modelName: "users",
      fields: {
        image: "avatar",
      },
      additionalFields: {
        bloodGroup: {
          type: "string",
          required: true,
        },
        district: {
          type: "string",
          required: true,
        },
        upazila: {
          type: "string",
          required: true,
        },
        role: {
          type: "string",
          defaultValue: roles.donor,
          input: false,
        },
        status: {
          type: "string",
          defaultValue: "active",
          input: false,
        },
      },
    },
    account: {
      modelName: "accounts",
    },
    session: {
      modelName: "sessions",
    },
    verification: {
      modelName: "verifications",
    },
  });

  return auth;
}
