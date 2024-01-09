import Elysia, { t } from "elysia";
import { User } from "../bll/user";
import { setup } from "../setup/setup";
import { authorizeFor } from "../plugins/authorizeFor";
import { UserRole } from "../bll/user/types";
import cookie from "@elysiajs/cookie";

export const accountController = (app: Elysia) =>
  app
    .use(setup)
    .use(cookie())
    .group("/account", (app) =>
      app
        .post(
          "/register",
          async ({ body, set }) => {
            try {
              const user = await User.create({
                email: body.email,
                password: body.password,
                role: UserRole.STUDENT,
                firstName: body.firstName,
                lastName: body.lastName,
                valid: false,
              });
              console.log("User validation token: ", user.validationToken);
              // TODO send mail to validate
            } catch (error) {
              console.log(error);
              set.status = 400;
            }
          },
          {
            detail: {
              tags: ["Account"],
              summary: "Register as a Student",
            },
            body: t.Object({
              email: t.String({
                format: "email",
              }),
              password: t.String(),
              firstName: t.String(),
              lastName: t.String(),
            }),
            response: {
              200: t.Undefined(),
              400: t.Undefined(),
            },
          }
        )
        .post(
          "/validate",
          async ({ body, set }) => {
            try {
              const user = await User.findByEmail(body.email);
              if (!user) {
                set.status = 401;
                return;
              }
              user.validate(body.token);
              return {
                email: user.email,
              };
            } catch (error) {
              set.status = 400;
            }
          },
          {
            detail: {
              tags: ["Account"],
              summary: "Validate the user using the token sent by email",
            },
            body: t.Object({
              email: t.String({
                format: "email",
              }),
              token: t.String(),
            }),
            response: {
              200: t.Object({
                email: t.String(),
              }),
              400: t.Undefined(),
              401: t.String(),
            },
          }
        )
        .post(
          "/login",
          async ({ body, setCookie, set }) => {
            try {
              const token = await User.authenticate({
                email: body.email,
                password: body.password,
              });
              const date = new Date();
              setCookie("gefortecanAuth", token, {
                sameSite: "none",
                secure: true,
                maxAge: 2628288,
                expires: new Date(date.setMonth(date.getMonth() + 1)),
                path: "/",
              });
              return {
                authToken: token,
              };
            } catch (error) {
              set.status = 401;
              return null;
            }
          },
          {
            detail: {
              tags: ["Account"],
              summary: "Set the AuthToken Cookie",
            },
            body: t.Object({
              email: t.String({
                format: "email",
              }),
              password: t.String(),
            }),
            response: {
              200: t.Object({
                authToken: t.String(),
              }),
              401: t.Null(),
            },
          }
        )
        .get(
          "/logout",
          async ({ setCookie }) => {
            const date = new Date();
            setCookie("gefortecanAuth", "", {
              sameSite: "none",
              secure: true,
              maxAge: 2628288,
              expires: new Date(date.setMonth(date.getMonth() + 1)),
              path: "/",
            });
          },
          {
            detail: {
              tags: ["Account"],
              summary: "Erase the AuthToken Cookie",
            },
          }
        )
        .post(
          "/forgot-password",
          async ({ body, set }) => {
            try {
              const user = await User.findByEmail(body.email);
              if (!user) {
                return;
              }
              const token = user.generateAuthToken();
              const updatedUser = await user.update({
                validationToken: token,
              });
              if (!updatedUser) {
                return;
              }
              console.log(
                "User validation token: ",
                updatedUser.validationToken
              );
              // TODO send email with token
              return;
            } catch (error) {
              set.status = 200;
            }
            return;
          },
          {
            detail: {
              tags: ["Account"],
              summary: "Send an email to reset the password",
            },
            body: t.Object({
              email: t.String({
                format: "email",
              }),
            }),
            response: {
              200: t.Undefined(),
            },
          }
        )
        .post(
          "/reset-password",
          async ({ body, set, store }) => {
            try {
              const user = await User.getFromAuthToken(body.token);
              if (!user) {
                throw new Error();
              }
              await user.resetPassword(body.password);
            } catch (error) {
              set.status = 401;
              return "Unauthorized";
            }
          },
          {
            detail: {
              tags: ["Account"],
              summary: "Reset the user's password, with validation token",
            },
            body: t.Object({
              password: t.String(),
              token: t.String(),
            }),
            response: {
              200: t.Undefined(),
              401: t.String(),
            },
          }
        )
        .guard(
          {
            async beforeHandle({ cookie, set, store }) {
              const user = await authorizeFor(cookie.gefortecanAuth.toString());
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
                "/auth",
                async ({ store }) => {
                  return {
                    role: store.user!.role,
                  };
                },
                {
                  detail: {
                    tags: ["Account"],
                    summary:
                      "Fast and small auth check that returns the user role",
                  },
                  response: {
                    200: t.Object({
                      role: t.Enum(UserRole),
                    }),
                    401: t.String(),
                  },
                }
              )
              .get(
                "",
                async ({ store, set }) => {
                  const { validationToken, password, ...user } = store.user!;
                  return user;
                },
                {
                  detail: {
                    tags: ["Account"],
                    summary: "Return the user",
                  },
                  response: {
                    200: "user",
                  },
                }
              )
              .post(
                "/change-password",
                async ({ body, set, store: { user } }) => {
                  try {
                    if (!user) {
                      throw new Error();
                    }
                    const result = await user.changePassword(
                      body.oldPassword,
                      body.newPassword
                    );
                    if (!result) {
                      throw new Error();
                    }
                  } catch (error) {
                    set.status = 401;
                    return "Unauthorized";
                  }
                },
                {
                  detail: {
                    tags: ["Account"],
                    summary:
                      "Change the user's password, with auth cookie and old password",
                  },
                  body: t.Object({
                    oldPassword: t.String(),
                    newPassword: t.String(),
                  }),
                  response: {
                    200: t.Undefined(),
                    401: t.String(),
                  },
                }
              )
              .patch(
                "",
                async ({ body, set, store: { user } }) => {
                  try {
                    const modifiedUser = await user!.update(body);
                    if (!modifiedUser) {
                      set.status = 400;
                      return;
                    }
                    const { validationToken, password, ...userResponse } =
                      modifiedUser;
                    return userResponse;
                  } catch (error) {
                    console.log(error);
                  }
                },
                {
                  detail: {
                    tags: ["Account"],
                    summary: "Modify the user's account",
                  },
                  body: "patchAccount",
                  response: {
                    200: "user",
                    400: t.Undefined(),
                    401: t.String(),
                  },
                }
              )
        )
    );
