import { Server } from "socket.io";  
import http from "http";
import express from "express";
import cors from "cors";

const app = express();

// ✅ Fix CORS for Express API
app.use(cors({
    origin: "https://chatty1-delta.vercel.app",  // Remove the extra `/`
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true  // If using cookies or authentication
}));

const server = http.createServer(app);

// ✅ Fix CORS for Socket.io (Correct Syntax)
const io = new Server(server, {
    cors: {
        origin: "https://chatty1-delta.vercel.app",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

// ✅ Store online users {userId: socketId}
const userSocketMap = {};

// ✅ Get receiver socket ID function (placed AFTER userSocketMap declaration)
export function getReceiverSocketId(userid) {
    return userSocketMap[userid];
}

io.on("connection", (socket) => {  
    console.log("A user connected:", socket.id);

    const userid = socket.handshake.query.userid;  

    if (userid) {
        userSocketMap[userid] = socket.id;  
    }

    // 🔹 Notify all users about online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);

        if (userid && userSocketMap[userid] === socket.id) {
            delete userSocketMap[userid];  
        }

        io.emit("getOnlineUsers", Object.keys(userSocketMap)); 
    });
});
export { io, server, app };
