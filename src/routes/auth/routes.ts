import express from "express";
import { accessControl } from "../../middlewares/xacml";
import {
  addDefaultLocation,
  loginSchemaValidation,
  signUpSchemaValidation,
  upgradeProfileSchemaValidation,
} from "./validations";
import { otpVerification } from "../../controller/authentication";
import * as userController from "../../controller/userController";

const router = express.Router();

router.post(
  "/signup",
  accessControl({ validation: signUpSchemaValidation }),
  userController.signUpUser
);

router.post(
  "/completeProfile",
  accessControl({ validation: upgradeProfileSchemaValidation }),
  userController.completeProfile
);

router.post(
  "/addDefaultLocation",
  accessControl({ validation: addDefaultLocation }),
  userController.addDefaultLocation
);

router.post(
  "/login",
  accessControl({ validation: loginSchemaValidation }),
  userController.loginUser
);
router.post("/send-otp", otpVerification.sendOTP);
router.get("/verify-otp", otpVerification.verifyOTP);

export default router;
