import Elysia from "elysia";
import swagger from "@elysiajs/swagger";

export const swaggerPlugin = (app: Elysia) => {
  if (process.env.NODE_ENV === "production") {
    return app;
  }
  return app.use(
    swagger({
      path: "/api/swagger",
      documentation: {
        info: {
          title: "Elysia API",
          version: "1.0.0",
          description: "Test API",
          contact: {
            email: "cgi@vincentgillot.com",
            name: "Vincent Gillot",
          },
        },
        tags: [
          {
            name: "Account",
            description: "Account endpoints for authentication",
          },
          {
            name: "Users",
            description: "User administration",
          },
        ],
      },
      swaggerOptions: {
        withCredentials: true,
      },
    })
  );
};
