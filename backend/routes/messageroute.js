import express from "express"
import { protectroute } from "../middleware/auth.middleware.js"
import { getmessages, getusersidebar, sendmessage } from "../controller/message.controller.js"
 const messageroute = express.Router()

 messageroute.get("/users",protectroute,getusersidebar)
 messageroute.get("/:id",protectroute,getmessages)

//  sending the messages
 messageroute.post("/send/:id",protectroute,sendmessage)



 export default messageroute