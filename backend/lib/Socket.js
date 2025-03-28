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


export function getReceiverSocketId(userid) {
    return userSocketMap[userid];
  }

const server = http.createServer(app);

// ✅ Fix CORS for Socket.io
const io = new Server(server, {
cors({
    origin: "https://chatty1-delta.vercel.app",  // Remove the extra `/`
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true  // If using cookies or authentication
});

});

// ✅ Store online users {userId: socketId}
const userSocketMap = {};

io.on("connection", (socket) => {  // ✅ Change "connect" to "connection"
    console.log("A user connected:", socket.id);

    const userid = socket.handshake.query.userid;  // ✅ Get user ID from query

    if (userid) {
        userSocketMap[userid] = socket.id;  // ✅ Store socket ID
    }

    // 🔹 Notify all users about online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);

        if (userid && userSocketMap[userid] === socket.id) {
            delete userSocketMap[userid];  // ✅ Remove only if it matches the socket ID
        }

        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // 🔹 Notify after removal
    });
});



export { io, server, app };
