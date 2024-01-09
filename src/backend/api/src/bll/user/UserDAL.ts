import { FilterQuery, SortValues, UpdateQuery } from "mongoose";
import { UserModel } from "./model";
import { IUserSchema } from "./schema";

export type FindManyArgument<T> = {
  query: FilterQuery<T & { _id: string }>;
  page?: number;
  size?: number;
  sort?: {
    key: string;
    direction: SortValues;
  };
};

export abstract class UserDAL {
  static async create(userData: IUserSchema) {
    try {
      return UserModel.create(userData);
    } catch (e: any) {
      throw new Error("Repo: Error creating");
    }
  }

  static async find({
    query,
    sort,
    size,
    page,
  }: FindManyArgument<IUserSchema>) {
    try {
      const transaction = UserModel.find(query);

      if (sort !== undefined) {
        transaction.collation({ locale: "en" });
        transaction.sort([[sort.key, sort.direction]] as any);
      }

      if (size !== undefined) {
        transaction.limit(size);
        page !== undefined && transaction.skip((page - 1) * size);
      }

      return transaction.exec();
    } catch (e: any) {
      throw new Error("Repo: Error finding");
    }
  }

  static async findById(id: string) {
    try {
      return UserModel.findById(id).exec();
    } catch (e: any) {
      throw new Error("Repo: Error finding");
    }
  }

  static async findOne(query: FindManyArgument<IUserSchema>["query"]) {
    try {
      return UserModel.findOne(query).exec();
    } catch (e: any) {
      throw new Error("Repo: Error finding");
    }
  }

  static async updateOneById(id: string, query: UpdateQuery<IUserSchema>) {
    try {
      return UserModel.findByIdAndUpdate(id, query, {
        new: true,
      });
    } catch (e: any) {
      throw new Error("Repo: Error finding");
    }
  }

  static async delete(id: string) {
    return await UserModel.findByIdAndDelete(id);
  }
}
