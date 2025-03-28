import express from "express"
import { checkauth, login, logout, signup,updateprofile } from "../controller/auth.controllers.js"
import { protectroute } from "../middleware/auth.middleware.js"
const router=express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)

// To  update the profile
router.put("/update",protectroute,updateprofile)

router.get("/check",protectroute,checkauth)
export default router