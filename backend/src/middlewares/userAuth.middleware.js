import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({
            success: false,
            message: "Not Authorised. Login Again!",
        });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        res.json({
            success: false,
            message: "Error in userAuth middleware.",
            error: error.message,
        });
    }
}