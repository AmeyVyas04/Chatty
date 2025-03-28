import { connectDB } from "./lib/db.js";
import express from "express";
import cookieParser from "cookie-parser";
import authroute from "./routes/authroute.js";
import messageoute from "./routes/messageroute.js";
import dotenv from "dotenv";
import cors from "cors"
import bodyParser from 'body-parser';
import { app,server } from "./lib/Socket.js";

dotenv.config();

let port = process.env.PORT 

app.use(cookieParser());
app.use(cors({
    origin: "https://chatty1-delta.vercel.app",  // Remove the extra `/`
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true  // If using cookies or authentication
}));

app.use(express.json());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


app.use("/api/auth", authroute);
app.use("/api/Messages", messageoute);



app.get("/", (req, res) => {
    res.send("Hello user!");
});




// ✅ Start Server Only After Connecting to Database
const startServer = async () => {
    try {
        await connectDB(); // ✅ Ensure DB is connected before starting server
        server.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    } catch (error) {
        console.error("Database connection failed", error);
        process.exit(1); // Stop process if DB connection fails
    }
};
startServer();
