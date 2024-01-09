import { UpdateQuery } from "mongoose";
import { User } from "./User";
import { IUserSchema } from "./schema";

export enum UserRole {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}

export interface IUser {
  _id: string;
  email: string;
  active: boolean;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePicture?: string;
  validationToken?: string;
  password: string;
}

export interface IUserClass extends IUser {
  validate(validationToken: string): Promise<boolean>;
  generateAuthToken(): string;
  update(query: UpdateQuery<IUserSchema>): Promise<User | null>;
  resetPassword(newPassword: string): Promise<User | null>;
  changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<User | null>;
  delete(): Promise<User | null>;
}

interface ICreateUser {
  email: string;
  password: string;
  valid: boolean;
}

interface ICreateAdmin extends ICreateUser {
  role: UserRole.ADMIN;
}

interface ICreateTeacher extends ICreateUser {
  role: UserRole.TEACHER;
  firstName: string;
  lastName: string;
  bio?: string;
  profilePicture?: string;
}

interface ICreateStudent extends ICreateUser {
  role: UserRole.STUDENT;
  firstName: string;
  lastName: string;
}

export type CreateUserDTO = ICreateAdmin | ICreateTeacher | ICreateStudent;
