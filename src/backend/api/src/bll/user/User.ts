import { UpdateQuery } from "mongoose";
import { JWT } from "../JWT";
import { UserDAL } from "./UserDAL";
import { UserStatic } from "./UserStatic";
import { IUser, IUserClass, UserRole } from "./types";
import { IUserSchema } from "./schema";

export class User extends UserStatic implements IUserClass {
  /**
   * User class.
   *
   * This class exposes methods and properties of the User object.
   */
  constructor(user: IUser) {
    super();
    this.validationToken = user.validationToken;
    this.password = user.password;

    this._id = user._id.toString();
    this.email = user.email;
    this.active = user.active;
    this.role = user.role;

    this.firstName = user.firstName;
    this.lastName = user.lastName;

    this.bio = user.bio;
    this.profilePicture = user.profilePicture;
  }
  // SHOULD NOT EXIT THE API
  public validationToken?: string;
  public password: string;

  // ADMIN
  public _id: string;
  public email: string;
  public active: boolean;
  public role: UserRole;
  // STUDENT
  public firstName?: string;
  public lastName?: string;
  // TEACHER
  public bio?: string;
  public profilePicture?: string;

  public async validate(validationToken: string) {
    const decodedToken = JWT.readJWT(validationToken);
    if (validationToken === this.validationToken) {
      if (decodedToken.id === this._id.toString()) {
        await this.update({
          valid: true,
          validationToken: null,
        });
        return true;
      }
    }
    return false;
  }

  public generateAuthToken(): string {
    const jwt = JWT.generateJWT({
      email: this.email,
      id: this._id,
      role: this.role,
    });
    return jwt;
  }

  public async update(query: UpdateQuery<IUserSchema>) {
    const user = await UserDAL.updateOneById(this._id, query);
    if (!user) {
      return null;
    }
    return new User(user.toObject());
  }

  public async resetPassword(newPassword: string): Promise<IUserClass | null> {
    const hashPass = Bun.password.hashSync(newPassword);
    const newUser = await this.update({
      password: hashPass,
    });
    return newUser;
  }

  public async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<IUserClass | null> {
    if (Bun.password.verifySync(oldPassword, this.password)) {
      const newPassHash = Bun.password.hashSync(newPassword);

      const newUser = await this.update({
        password: newPassHash,
      });

      return newUser;
    }
    return null;
  }

  public async delete(hard?: boolean) {
    if (hard) {
      await UserDAL.delete(this._id);
      return this;
    }
    return await this.update({
      active: false,
    });
  }
}
