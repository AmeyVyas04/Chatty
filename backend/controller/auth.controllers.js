import jwt from "jsonwebtoken"; // ✅ Make sure this is at the top
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generatetoken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    try {
        const { email, name, password, profilepic } = req.body;

        // Check if all fields are provided
        if (!email || !name || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password should be at least 6 characters long" });
        }

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newuser = new User({
            email,
            name,
            password: hashedpassword,  // Fixed typo
            profilepic,
        });

        // Save user and generate token
        await newuser.save();
        generatetoken(newuser._id, res);

        res.status(201).json({ message: "User authenticated successfully" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // ✅ Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // ✅ Generate JWT token
        const token = jwt.sign({ userid: user._id }, process.env.JWT_SECRTE, { expiresIn: "7d" });

        console.log("Generated Token:", token);  // ✅ Debugging

        // ✅ Set HTTP-only cookie
        res.cookie("jwt", token, {
            httpOnly: true,    // Prevents access from frontend JavaScript
            secure: process.env.NODE_ENV === "production",  // Only secure in production
            sameSite: "None",  // ✅ Important for cross-origin requests!
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        console.log("Cookies Set:", res.getHeaders()["set-cookie"]);  // ✅ Debugging

        res.status(200).json({ message: "User logged in successfully" });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const logout = (req, res) => {
    try {
        // ✅ Properly clear the JWT cookie
        res.cookie("jwt", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            expires: new Date(0) // Expire instantly
        });
        res.status(200).json({ message: "Logged out successfully" });
        
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const updateprofile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        // Upload image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: "profile_pictures", // Optional: Store in a specific folder
        });

        // Update user in MongoDB
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilepic: uploadResponse.secure_url }, // Ensure the field matches MongoDB
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const checkauth = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Fetch the latest user data from MongoDB
        const updatedUser = await User.findById(req.user._id).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Check Auth Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

    

