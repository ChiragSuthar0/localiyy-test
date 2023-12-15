import { NextFunction, Request, Response } from "express";
import { validateJwt, findJwt } from "../providers/jwt";
import { JwtPayload } from "jsonwebtoken";

export default async (req: Request, _res: Response, next: NextFunction) => {
  const token = findJwt(req);
  if (token) {
    const decoded = validateJwt(token) as JwtPayload;
    if (decoded?.data?.id) {
      const user = undefined;
      if (user) {
        req.user = user;
      }
    }
  }

  return next();
};
