import Joi from "joi";
import mongoose from "mongoose";
import JoiPasswordComplexity from "joi-password-complexity";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name is required"],
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		unique: true,
		lowercase: true,
	},
	passwordHash: {
		type: String,
		required: [true, "Password is required"],
	},
	birthday: Date,

	membershipTier: {
		type: String,
		enum: ["Free", "Basic", "Premium"],
		default: "Free",
	},
	membershipStartDate: { type: Date },
	membershipEndDate: { type: Date },
	billingCycle: {
		type: String,
		enum: ["Monthly", "Annually"],
	},
	role: {
		type: String,
		enum: ["User", "Admin"],
		default: "User",
	},
	createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("users", userSchema);

const passwordOptions = {
	min: 8,
	max: 64,
	lowerCase: 1,
	upperCase: 1,
	numeric: 1,
	symbol: 1,
};

export function validateUser(user: any) {
	const userSchema = Joi.object({
		name: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(8).max(64).required(),
	});
	let result = userSchema.validate(user);
	if (result.error) {
		return { message: result.error.details[0].message };
	}
	result = JoiPasswordComplexity(passwordOptions).validate(user.password);
	if (result.error) {
		return {
			message:
				"Password must be at least 8 characters long, have at least 1 lowercase, uppercase, number, special symbol",
		};
	}
}

export default User;
