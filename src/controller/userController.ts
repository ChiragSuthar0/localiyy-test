import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../schema/User";
import bcrypt from "bcrypt";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { signJwt } from "../providers/jwt";
import { randomUUID } from "crypto";

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
    const { password, email, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return next(new AppError("Email Taken", 401));
    }

    const {
      uniqueNamesGenerator,
      adjectives,
      colors,
      animals,
    } = require("unique-names-generator");

    const shortName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals, colors],
      length: 2,
    });

    const newUser = await User.create({
      name: name,
      username: shortName,
      email: email,
      password: hashedPassword,
      active: true,
      location: {
        type: "Point",
        coordinates: req.body.coordinates ?? [72.57094444, 23.02666667],
      },
      role: "user",
      createdAt: Date.now(),
    });

    res.status(201).json({
      status: "success",
      newUser,
    });
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

export const completeProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, avatar, email } = req.body;

    if (username.includes(" "))
      return new AppError("Username cannot have space between", 400);

    const existingUsername = await User.findOne({ username: username });

    if (existingUsername) {
      return next(new AppError("Username Taken", 401));
    }

    const existingUser = await User.findOneAndUpdate(
      { email: email },
      {
        username: username,
        avatar: avatar,
      }
    );

    if (existingUser) {
      res.status(200).json({
        status: "success",
        existingUser,
      });
    }
  }
);

export const addDefaultLocation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, location } = req.body;

    const existingUser = await User.findOneAndUpdate(
      { email: email },
      {
        location: location,
      }
    );

    res.status(200).json({
      status: "success",
      existingUser,
    });
  }
);
