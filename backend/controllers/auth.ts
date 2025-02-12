import Joi from "joi";
import authService from "../services/auth";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { HttpError } from "../middlewares/error";

class AuthController {
	async login(request: Request, response: Response, next: NextFunction) {
		const login = request.body;
		const error = validateLogin(login);
		if (error) {
			return response.status(400).send(error);
		}
		try {
			// Return JSON Web Token
			const { accessToken, refreshToken } = await authService.login(
				login.email,
				login.password,
				login.remember
			);

			response
				.status(200)
				.header("X-Access-Token", accessToken)
				.cookie("X-Refresh-Token", refreshToken, {
					maxAge: login.remember ? 2592000000 : 432000000,
					httpOnly: true,
					secure: true,
					domain: request.header("Host")?.split(":")[0],
					sameSite: "lax",
				})
				.send({ message: "Success" });
		} catch (err) {
			if (err instanceof HttpError) {
				response.status(400).send(err);
			} else {
				next(err);
			}
		}
	}

	async refreshAccessToken(
		request: Request,
		response: Response,
		next: NextFunction
	) {
		try {
			const refreshToken = request.cookies["X-Refresh-Token"];
			if (!refreshToken) {
				return response.status(400).send({
					status: "INVALID_REFRESH_TOKEN",
					message: "Invalid or missing refresh tokens",
				});
			}
			const accessToken = await authService.refreshAccessToken(
				refreshToken
			);
			response
				.status(200)
				.header("X-Access-Token", accessToken)
				.send({ message: "Success" });
		} catch (err) {
			if (err instanceof HttpError) {
				response.status(400).send(err);
			} else {
				next(err);
			}
		}
	}
}

const validateLogin = (login: any) => {
	const loginSchema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(8).max(64).required(),
		remember: Joi.boolean(),
	});
	const result = loginSchema.validate(login);
	if (result.error) {
		return { message: result.error.details[0].message };
	}
};

const authController = new AuthController();
export default authController;
