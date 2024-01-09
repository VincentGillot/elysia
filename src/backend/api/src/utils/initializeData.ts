import { User } from "../bll/user";
import { UserRole } from "../bll/user/types";
import md5 from "md5";

export const initializeData = async () => {
  const users = await User.findManyByRole(UserRole.ADMIN);
  console.log(md5(process.env.INITIAL_ADMIN_PASSWORD!));
  if (!users.length) {
    console.log("Creating admin user");
    try {
      await User.create({
        email: process.env.INITIAL_ADMIN_EMAIL!,
        password: md5(process.env.INITIAL_ADMIN_PASSWORD!),
        role: UserRole.ADMIN,
        valid: true,
      });
      console.log("Admin created");
    } catch (error: any) {
      throw new Error(error);
    }
  }
};
