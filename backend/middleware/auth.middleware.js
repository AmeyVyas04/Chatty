import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectroute = async (req, res, next) => {
    try {
        // Debug: Check if cookies are received
        console.log("Cookies received:", req.cookies);

        // Get token from cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRTE);
        } catch (error) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        // Find user from token
        const user = await User.findById(decoded.userid).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Attach user to request object
        req.user = user;
        next(); // Proceed to the next middleware

    } catch (error) {
        console.error("Protect route error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
