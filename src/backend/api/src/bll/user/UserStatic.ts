import { JWT } from "../JWT";
import { User } from "./User";
import { FindManyArgument, UserDAL } from "./UserDAL";
import { IUserSchema } from "./schema";
import { CreateUserDTO, UserRole } from "./types";

export abstract class UserStatic {
  /**
   * This will create a user on the DB.
   *
   * Important!: This is not a registration methods, it will not handle validation.
   *
   * Password is hashed here!
   */
  static async create(createUserDTO: CreateUserDTO) {
    // Hash the password
    const hashPass = Bun.password.hashSync(createUserDTO.password);
    // Verify with Bun.password.verify()

    // Create on DB
    let newUser = await UserDAL.create({
      ...createUserDTO,
      password: hashPass,
      active: true,
    });

    // If user is not created as valid, we need the validation token set to then validate later.
    if (!createUserDTO.valid) {
      const validationToken = JWT.generateJWT({
        id: newUser._id.toString(),
        email: newUser.email,
        role: newUser.role,
      });
      newUser.validationToken = validationToken;
      await newUser.save();
    }

    return new User(newUser.toObject());
  }

  static async findManyByRole(role: UserRole) {
    const users = await UserDAL.find({
      query: {
        role: role,
      },
    });
    const userClasses = users.map((u) => new User(u.toObject()));
    return userClasses;
  }

  static async findById(id: string) {
    const user = await UserDAL.findById(id);
    if (!user) return null;
    return new User(user.toObject());
  }

  static async findByEmail(email: string) {
    const user = await UserDAL.findOne({
      email: email,
    });
    if (!user) return null;
    return new User(user.toObject());
  }

  static async authenticate({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const user = await UserDAL.findOne({
      email: email,
      valid: true,
    });
    if (!user) {
      throw new Error("not_found");
    }
    const userClass = new User(user.toObject());
    if (!Bun.password.verifySync(password, user.password)) {
      throw new Error("invalid_pass");
    }
    return userClass.generateAuthToken();
  }

  static async getFromAuthToken(token: string) {
    const decodedToken = JWT.readJWT(token);
    const user = await this.findById(decodedToken.id);
    return user;
  }

  static async find({
    query,
    sort,
    size,
    page,
  }: FindManyArgument<IUserSchema>) {
    const users = await UserDAL.find({
      query,
      sort,
      size,
      page,
    });
    const userClasses = users.map((u) => new User(u.toObject()));
    return userClasses;
  }
}
