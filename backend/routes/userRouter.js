import express from "express";
import {
  createUserController,
  getAllUsersController,
  getUserIdController,
  updateUserController,
  deleteUserController,
} from "../controllers/usersController.js";
import { isAuth, reqRole } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.use(isAuth);
userRouter.use(reqRole("ADMINISTRATOR"));

userRouter.get("/", getAllUsersController);
userRouter.get("/:id", getUserIdController);
userRouter.post("/", createUserController);
userRouter.patch("/:id", updateUserController);
userRouter.delete("/:id", deleteUserController);

export default userRouter;
