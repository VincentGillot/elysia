import Elysia, { t } from "elysia";
import { User } from "../bll/user";
import {
  tAdminInput,
  tFindUsersInput,
  tPatchAccount,
  tPatchUser,
  tStudentInput,
  tTeacherInput,
} from "../tTypes/inputs";
import { userOutput, usersArrayOutput } from "../tTypes/outputs";

export const setup = new Elysia({ name: "setup" })
  .state("user", null as null | User)
  .onRequest(({ set }) => {
    set.headers["x-powered-by"] = "Vincent Gillot";
    set.headers["x-version"] = "1";
  })
  .model({
    createUser: t.Union([tAdminInput, tStudentInput, tTeacherInput]),
    user: userOutput,
    users: usersArrayOutput,
    usersFilter: tFindUsersInput,
    patchAccount: tPatchAccount,
    patchUser: tPatchUser,
  });
