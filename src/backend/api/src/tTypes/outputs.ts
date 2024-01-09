import { t } from "elysia";
import { UserRole } from "../bll/user/types";

export const userOutput = t.Object({
  _id: t.String(),
  email: t.String({
    format: "email",
  }),
  active: t.Boolean(),
  role: t.Enum(UserRole),
  firstName: t.Optional(t.String()),
  lastName: t.Optional(t.String()),
  bio: t.Optional(t.String()),
  profilePicture: t.Optional(t.String()),
});

export const usersArrayOutput = t.Array(userOutput);
