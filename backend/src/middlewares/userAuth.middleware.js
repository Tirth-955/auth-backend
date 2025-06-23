import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized. Login Again!",
        });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);


        if (!tokenDecode || !tokenDecode.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Login Again!",
            });
        }

        req.userId = tokenDecode.id;
        next();

    } catch (error) {

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expired. Please login again.",
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please login again.",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error authenticating user.",
            error: error.message,
        });
    }
}

export default userAuth;