import mongoose from "mongoose";
import { User } from "@screen-guide/types";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  watchList: {
    items: [
      {
        name: { type: String, required: true },
        imageUrl: { type: String, required: true },
        rating: { type: Number, required: true },
        releaseDate: { type: String, required: true },
        type: { type: String, required: true },
        duration: { type: String, required: false },
      },
    ],
  },
});

export const UserModel = mongoose.model("User", UserSchema);

export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserById = (id: string) => UserModel.findById(id);

export const createUser = (values: User) =>
  new UserModel(values).save().then((user) => user.toObject());

export const updateUserById = (id: string, values: Partial<User>) =>
  UserModel.findByIdAndUpdate(id, { $set: values }, { new: true });
