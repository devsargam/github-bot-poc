import SmeeClient from "smee-client";
import { App, createNodeMiddleware } from "octokit";
import { createServer } from "http";
import "dotenv/config";

console.log(process.env);

const app = new App({
  appId: 1095421,
  oauth: {
    clientId: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
  },
  privateKey: process.env.PRIVATE_KEY!,
  webhooks: {
    secret: process.env.WEBHOOK_SECRET!,
  },
});

const smee = new SmeeClient({
  source: "https://smee.io/pXor4ujSNGpqzekj",
  target: "http://localhost:3000/events",
  logger: console,
});

const main = async () => {
  const events = smee.start();

  app.webhooks.on("issues.opened", async ({ octokit, payload }) => {
    console.log(payload);

    return octokit.rest.issues.createComment({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.issue.number,
      body: "Hello, World!",
    });
  });

  app.webhooks.on("installation.created", async ({ octokit, payload }) => {
    console.log(payload);
  });

  app.webhooks.on("installation.deleted", async ({ octokit, payload }) => {
    console.log(payload);
  });

  app.webhooks.on("installation.suspend", async ({ octokit, payload }) => {
    console.log(payload);
  });
};

createServer(createNodeMiddleware(app))
  .listen(3000)
  .on("listening", () => {
    main();
    console.log("server is listening");
  })
  .on("error", (error) => {
    console.error(error);
  });
