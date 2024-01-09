import { User } from "../bll/user";
import { UserRole } from "../bll/user/types";

export const authorizeFor = async (token: string, roles?: UserRole[]) => {
  if (!token) {
    return null;
  }
  const user = await User.getFromAuthToken(token);
  if (!user || !user.active) {
    return null;
  }
  if (roles) {
    if (!roles.includes(user.role)) {
      return null;
    }
  }
  return user;
};
