import express from "express";
import { register, login, logout, me } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.get("/me", me);

authRouter.delete("/logout", logout);

export default authRouter;
