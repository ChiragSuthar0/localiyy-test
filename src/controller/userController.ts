import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../schema/User";
import bcrypt from "bcrypt";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { signJwt } from "../providers/jwt";

const createSendToken = (
  userDetails: IUser,
  statusCode: number,
  rememberMe: boolean,
  res: Response
) => {
  const token = signJwt(userDetails, rememberMe);

  res.status(statusCode).json({
    status: "success",
    userDetails,
    token,
  });
};

export const signUpUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, email, name, photo, location } = req.body;

    if (username.includes(" "))
      return new AppError("Username cannot have space between", 400);

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return next(new AppError("Email Taken", 401));
    }

    const existingUsername = await User.findOne({ username: username });

    if (existingUsername) {
      return next(new AppError("Username Taken", 401));
    }

    const newUser = await User.create({
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
      location: location,
      active: false,
      photo: photo,
      role: "user",
      createdAt: Date.now(),
    });

    createSendToken(newUser, 201, req.body.rememberMe ?? false, res);
  }
);

export const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new AppError("User not found", 404));

    if (await bcrypt.compare(password, user.password)) {
      return createSendToken(user, 200, req.body.rememberMe ?? false, res);
    } else {
      return next(new AppError("Incorrect Password or Username", 403));
    }
  }
);
