import { User } from "../models/user.model.js";

export const getUserData = async (req, res) => {
    try {
        const { userId } = req;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found!",
            });
        }

        res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified,

            }
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
}