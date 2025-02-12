import mongoose from "mongoose";
import User,{ UserType} from "../models/user";
import lodash from "lodash";
import bcrypt from "bcrypt";
import fs from "fs";
import { HttpError } from "../middlewares/error";

class UserService {
	async getAllUsers() {
		const users = await User.find().select({
				passwordHash: 0,
			});
		return users;
	}

	async getUserByID(userID: string) {
		try {
			const user = await User.findById(userID).select({
				passwordHash: 0,
			});
			if (!user) {
				throw new mongoose.Error.DocumentNotFoundError("User not found");
			}
			return user;
		} catch (err) {
			throw err;
		}
	}

	async createUser(user: any) {
		try {
			const existingUser = await User.findOne({ email: user.email });
			console.log(existingUser);
			if (existingUser) {
	
				throw new HttpError(
					"User already exists",
					"DUPLICATE_USER"
				);
			}

			const salt = await bcrypt.genSalt(10);
			user.passwordHash = await bcrypt.hash(user.password, salt);
			return lodash.pick(await User.create(user), [
				"_id",
				"name",
				"email",
				"createdAt",
			]);
		} catch (err) {
			throw err;
		}
	}

	async updateUser(user: UserType, userID: string) {
		try {
			const updatedUser = await User.findByIdAndUpdate(userID, user, {
				new: true,
			}).select({
				passwordHash: 0,
			});
			if (!updatedUser) {
				throw new mongoose.Error.DocumentNotFoundError("User not found");
			}
			return updatedUser;
		} catch (err) {
			throw err;
		}
	}

	async deleteUserByID(userID: string) {
		try {
			const deletedUser = await User.findByIdAndDelete(userID).select({
				passwordHash: 0,
			});
			if (!deletedUser) {
				throw new mongoose.Error.DocumentNotFoundError("User not found");
			}
			return deletedUser;
		} catch (err) {
			throw err;
		}
	}

	async deleteAllUsers() {
		try {
			return await User.deleteMany({});
		} catch (err) {
			throw err;
		}
	}
}

const userService = new UserService;
export default userService;