import { Elysia } from "elysia";
import mongoose from "mongoose";
import { initializeData } from "./utils/initializeData";
import { accountController } from "./controllers/account.controller";
import { swaggerPlugin } from "./plugins/swaggerPlugin";
import { userController } from "./controllers/user.controller";

const app = new Elysia()
  .use(swaggerPlugin)
  .group("/api", (app) => app.use(accountController).use(userController))
  .listen(3001);

try {
  mongoose.connection.on("error", (err) => {
    console.log(err);
  });

  await mongoose.connect(process.env.MONGO_URL!);

  await initializeData();

  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
} catch (error) {
  console.log(error);
}

export type Api = typeof app;
