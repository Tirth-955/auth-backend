import express from "express";
import userAuth from "../middlewares/userAuth.middleware.js";
import { getUserData } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/data", userAuth, getUserData)

export default router;