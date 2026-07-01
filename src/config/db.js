import { MongoClient, ServerApiVersion } from "mongodb";

import { env } from "./env.js";

let client;
let database;
let connectionPromise;

export async function connectDB() {
  if (database) {
    return database;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is missing in .env");
  }

  connectionPromise = (async () => {
    client = new MongoClient(env.mongoUri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await client.connect();
    database = client.db("bloodConnect");
    console.log("MongoDB connected");

    return database;
  })();

  try {
    return await connectionPromise;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
}

export function getDB() {
  if (!database) {
    throw new Error("Database is not connected yet");
  }

  return database;
}

export function isDBConnected() {
  return Boolean(database);
}
