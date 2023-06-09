import express from "express";
import {getMyProfile, login, logout, registerUser } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();


router.post("/new",registerUser)

router.post("/login",login)
router.get("/logout",logout)

router.get("/me", isAuthenticated, getMyProfile)

export default router; 
