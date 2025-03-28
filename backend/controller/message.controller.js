import User from "../models/user.model.js";
import Message from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/Socket.js";

/**
 * Get all users except the logged-in user for the sidebar
 */
export const getusersidebar = async (req, res) => {
    try {
        const loggedinuserid = req.user._id;

        // Fetch all users except the logged-in user
        const filteredUsers = await User.find({ _id: { $ne: loggedinuserid } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Get messages between logged-in user and selected user
 */
export const getmessages = async (req, res) => {
    try {
        const { id: userTOChatId } = req.params;
        const myid = req.user._id;

        if (!userTOChatId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch messages where sender or receiver is the current user
        const messages = await Message.find({
            $or: [
                { senderid: myid, receiversid: userTOChatId },
                { senderid: userTOChatId, receiversid: myid }
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Send a new message
 */
export const sendmessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiversid } = req.params;
        const senderid = req.user._id; // ✅ Define senderid

        let imageurl = null;
        if (image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageurl = uploadResponse.secure_url;
            } catch (uploadError) {
                console.error("Error uploading image:", uploadError);
                return res.status(500).json({ message: "Failed to upload image" });
            }
        }

        // Create and save the new message
        const newMessage = new Message({
            senderid,
            receiversid,
            text,
            image: imageurl
        });
        await newMessage.save();

        // live receving of the message by sockentio
        const receiverSocketId = getReceiverSocketId(receiversid);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }
    
        
        res.status(200).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
