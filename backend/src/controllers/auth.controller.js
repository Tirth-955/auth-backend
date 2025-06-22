import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { createTransporter } from "../config/nodemailer.js";
import { use } from "react";

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(401).json({
            success: false,
            message: "Missing Details!"
        });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // sending Welcome Email
        try {
            const transporter = createTransporter();
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: "Welcome to One Piece",
                text: `Welcome to One Piece World. Let's Continue Our Adventure!, Your registered email is ${email}`,
            };
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Email send error:", error);
        }

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in registerUser controller",
            error: error.message
        });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({
            success: false,
            message: "Email & Password Are Required!"
        });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exist."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password."
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        console.log("Logged In Successfully.")

        return res.status(200).json({
            success: true,
            message: "Logged In Successfully."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in loginUser controller.",
            error: error.message
        });
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        return res.status(200).json({
            success: true,
            message: "Logged Out Successfully."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in logoutUser controller",
            error: error.message
        });
    }
}

// Send Verification OTP to User's Email
export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);

        if (user.isAccountVerified) {
            return res.json({
                success: false,
                message: "Account is ALready Verified."
            });
        }

        const otp = String(Math.floor(1_00_000 + Math.random() * 9_00_000));

        user.verifyOtp = otp;

        user.verifyOtpExpiredAt = Date.now() + 1 * 60 * 60 * 1000;

        await user.save();

        const transporter = createTransporter();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your OTP is ${otp}. Verify Your Account Using This OTP.`,
        }
        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: "Verification OTP Sent On Email."
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Error in sendVerifyOtp controller",
            error: error.message
        })
    }
}

export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.json({
            success: false,
            message: "Missing Details!"
        });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found!"
            });
        }

        if (user.verifyOtp === "" || user.verifyOtp != otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP!"
            });
        }

        if (user.verifyOtpExpiredAt < Date.now()) {
            return res.status(408).json({
                success: false,
                message: "OTP Expired!"
            });
        }

        user.isAccountVerified = true;

        user.verifyOtp = "";
        user.verifyOtpExpiredAt = 0;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email Verified Successfully."
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Error in verifyEmail controller",
            error: error.message
        })
    }
}       