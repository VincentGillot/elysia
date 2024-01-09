import Elysia, { t } from "elysia";
import { setup } from "../setup/setup";
import { authorizeFor } from "../plugins/authorizeFor";
import { UserRole } from "../bll/user/types";
import { User } from "../bll/user";
import { SortOrder } from "mongoose";

export const userController = (app: Elysia) =>
  app.use(setup).group("/users", (app) =>
    app.guard(
      {
        async beforeHandle({ cookie, set, store }) {
          const user = await authorizeFor(cookie.gefortecanAuth.toString(), [
            UserRole.ADMIN,
          ]);
          if (!user) {
            set.status = 401;
            return "Unauthorized";
          }
          store.user = user;
        },
      },
      (app) =>
        app
          .get(
            "",
            async ({ query }) => {
              const users = await User.find({
                query: {
                  ...(query.role && { role: query.role }),
                },
                ...(query.page && { page: query.page }),
                ...(query.size && { size: query.size }),
                ...(query.key &&
                  query.direction && {
                    sort: {
                      key: query.key,
                      direction: query.direction as SortOrder,
                    },
                  }),
              });

              return users;
            },
            {
              detail: {
                tags: ["Users"],
                summary: "Get all users, with filters and pagination",
              },
              query: "usersFilter",
              response: {
                200: "users",
              },
            }
          )
          .get(
            "/:id",
            async ({ set, params }) => {
              const user = await User.findById(params.id);
              if (!user) {
                set.status = 404;
                return;
              }
              const { validationToken, password, ...userResponse } = user;
              return userResponse;
            },
            {
              detail: {
                tags: ["Users"],
                summary: "Get user by ID",
              },
              response: {
                200: "user",
                404: t.Undefined(),
                401: t.String(),
              },
            }
          )
          .post(
            "",
            async ({ body }) => {
              let user: User;
              switch (body.role) {
                case UserRole.ADMIN:
                  user = await User.create({
                    email: body.email,
                    password: body.password,
                    role: body.role,
                    valid: true,
                  });
                  break;
                case UserRole.TEACHER:
                  user = await User.create({
                    email: body.email,
                    password: body.password,
                    role: body.role,
                    valid: true,
                    firstName: body.firstName,
                    lastName: body.lastName,
                    bio: body.bio,
                    profilePicture: body.profilePicture,
                  });
                  break;
                case UserRole.STUDENT:
                  user = await User.create({
                    email: body.email,
                    password: body.password,
                    role: body.role,
                    valid: true,
                    firstName: body.firstName,
                    lastName: body.lastName,
                  });
                  break;
              }
              const { validationToken, password, ...userResponse } = user;
              return userResponse;
            },
            {
              detail: {
                tags: ["Users"],
                summary: "Create users",
              },
              body: "createUser",
              response: {
                200: "user",
                401: t.String(),
              },
            }
          )
          .delete(
            "/:id",
            async ({ set, params }) => {
              const user = await User.findById(params.id);
              if (!user) {
                set.status = 404;
                return;
              }
              const deletedUser = await user.delete(true);
              if (!deletedUser) {
                set.status = 400;
                return;
              }
              const { validationToken, password, ...userResponse } =
                deletedUser;
              return userResponse;
            },
            {
              detail: {
                tags: ["Users"],
                summary: "Permanently deletes a User",
              },
              response: {
                200: "user",
                404: t.Undefined(),
                400: t.Undefined(),
              },
            }
          )
          .patch(
            "/:id",
            async ({ body, set, params }) => {
              const user = await User.findById(params.id);
              if (!user) {
                set.status = 404;
                return;
              }
              const modifiedUser = await user.update(body);
              if (!modifiedUser) {
                set.status = 400;
                return;
              }
              const { validationToken, password, ...userResponse } =
                modifiedUser;
              return userResponse;
            },
            {
              detail: {
                tags: ["Users"],
                summary: "Patch user properties",
              },
              body: "patchUser",
              response: {
                200: "user",
                404: t.Undefined(),
                400: t.Undefined(),
              },
            }
          )
    )
  );
