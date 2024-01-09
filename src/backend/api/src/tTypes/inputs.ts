import { t } from "elysia";
import { UserRole } from "../bll/user/types";

export const tAdminInput = t.Object(
  {
    role: t.Literal(UserRole.ADMIN),
    email: t.String({
      format: "email",
    }),
    password: t.String(),
  },
  {
    description: "Create ADMIN User",
  }
);

export const tStudentInput = t.Object(
  {
    role: t.Literal(UserRole.STUDENT),
    email: t.String({
      format: "email",
    }),
    password: t.String(),
    firstName: t.String(),
    lastName: t.String(),
  },
  {
    description: "Create STUDENT User",
  }
);

export const tTeacherInput = t.Object(
  {
    role: t.Literal(UserRole.TEACHER),
    email: t.String({
      format: "email",
    }),
    password: t.String(),
    firstName: t.String(),
    lastName: t.String(),
    bio: t.Optional(t.String()),
    profilePicture: t.Optional(t.String()),
  },
  {
    description: "Create TEACHER User",
  }
);

export const tFindUsersInput = t.Optional(
  t.Object({
    role: t.Optional(t.Enum(UserRole)),
    page: t.Optional(t.Numeric()),
    size: t.Optional(t.Numeric()),
    key: t.Optional(t.String()),
    direction: t.Optional(t.String()),
  })
);

export const tPatchAccount = t.Object({
  firstName: t.Optional(t.String()),
  lastName: t.Optional(t.String()),
  bio: t.Optional(t.String()),
  profilePicture: t.Optional(t.String()),
});

export const tPatchUser = t.Object({
  firstName: t.Optional(t.String()),
  lastName: t.Optional(t.String()),
  bio: t.Optional(t.String()),
  profilePicture: t.Optional(t.String()),
  active: t.Optional(t.Boolean()),
});
