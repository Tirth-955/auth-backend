import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res
            .status(401)
            .json({
                success: false,
                message: "Missing Details!"
            })
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(200)
                .json({
                    success: false,
                    message: "User Already Exists."
                })
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

        res
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production"
            })
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: "Error in registerUser controller\n", error
            })
    }
}