import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    sendVerifyOtp,
    verifyEmail,
    isAuthenticated
} from "../controllers/auth.controller.js";
import userAuth from "../middlewares/userAuth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/send-verify-otp", userAuth, sendVerifyOtp);
router.post("/verify-account", userAuth, verifyEmail);
router.post("/is-auth", userAuth, isAuthenticated);

export default router;