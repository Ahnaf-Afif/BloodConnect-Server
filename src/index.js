import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { createIndexes } from "../database/indexes.js";

async function startServer() {
  await connectDB();
  await createIndexes();

  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
