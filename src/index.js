import app from "./app.js";
import { env } from "./config/env.js";
import { setupServer } from "./config/setup.js";

async function startServer() {
  await setupServer();

  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
