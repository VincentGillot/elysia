import { Schema } from "mongoose";
import { UserRole } from "./types";

export interface IUserSchema {
  email: string;
  active: boolean;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePicture?: string;
  password: string;
  valid: boolean;
  validationToken?: string;
}

export const UserSchema = new Schema<IUserSchema>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
      index: true,
    },
    valid: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
    role: {
      type: String,
      enum: UserRole,
      required: true,
    },
    validationToken: String,
    firstName: String,
    lastName: String,
    bio: String,
    profilePicture: String,
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);
