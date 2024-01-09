import jwt from "jsonwebtoken";
import { UserRole } from "./user/types";

export abstract class JWT {
  static generateJWT(payload: { email: string; role: UserRole; id: string }) {
    if (!process.env.JWT_SECRET) {
      throw new Error("no_jwt");
    }
    return jwt.sign(payload, process.env.JWT_SECRET);
  }

  static readJWT(token: string) {
    if (!process.env.JWT_SECRET) {
      throw new Error("no_jwt");
    }
    return jwt.verify(token, process.env.JWT_SECRET) as {
      email: string;
      role: UserRole;
      id: string;
      iat: number;
    };
  }
}
