import { NextFunction, Request, Response } from "express";
import AppError from "./appError";

export default function catchAsync(
  fn: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void | AppError>
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
