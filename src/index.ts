import { Container, getContainer } from "@cloudflare/containers";
import { Hono } from "hono";

export class MyContainer extends Container<Env> {
  // Port the container listens on (default: 8080)
  defaultPort = 8080;
  // Time before container sleeps due to inactivity (default: 30s)
  sleepAfter = "10m";
  // Environment variables passed to the container
  envVars = {
    MESSAGE: "I was passed in via the container class!",
  };

  // Optional lifecycle hooks
  override onStart() {
    console.log("Container successfully started");
  }

  override onStop() {
    console.log("Container successfully shut down");
  }

  override onError(error: unknown) {
    console.log("Container error:", error);
  }
}

// Create Hono app with proper typing for Cloudflare Workers
const app = new Hono<{
  Bindings: Env;
}>();

// Home route with available endpoints

// Get a single container instance (singleton pattern)
app.get("/", async (c) => {
  return c.json({ message: "The task is running in the background" }, 200);
});

export default {
  fetch: app.fetch,
  async scheduled(_controller: any, env: Env) {
    await getContainer(env.MY_CONTAINER).startAndWaitForPorts({
      startOptions: {
        envVars: {
          OPENSTATUS_KEY: env.OPENSTATUS_KEY,
        },
      },
    });
  },
};
