import { MongoClient, ServerApiVersion } from "mongodb";

import { env } from "./env.js";

let client;
let database;

export async function connectDB() {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is missing in .env");
  }

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
