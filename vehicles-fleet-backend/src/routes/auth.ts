import { Request, Response } from "express";
import { AuthController } from "../controllers/Auth.controller";
import { UserController } from "../controllers/User.controller";
const express = require("express");

const userRouter = express.Router();
const authController = new AuthController();
const userController = new UserController();

userRouter.post('/login/', authController.loginUser);
userRouter.post('/register/', userController.createUser);
userRouter.post('/token', authController.refreshToken);

module.exports = userRouter;

