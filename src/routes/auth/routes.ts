import express from "express";
import { accessControl } from "../../middlewares/xacml";
import { loginSchemaValidation, singupSchemaValidation } from "./validations";
import { otpVerification } from "../../controller/authentication";
import * as userController from "../../controller/userController";

const router = express.Router();

router.post(
  "/signup",
  accessControl({ validation: singupSchemaValidation }),
  userController.signUpUser
);

router.post(
  "/login",
  accessControl({ validation: loginSchemaValidation }),
  userController.loginUser
);
router.post("/send-otp", otpVerification.sendOTP);
router.get("/verify-otp", otpVerification.verifyOTP);

export default router;
