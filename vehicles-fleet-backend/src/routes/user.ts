import {Request, Response} from "express";
import { AuthController } from "../controller/Auth.controller";
const express = require("express");

const userRouter = express.Router();
const authController = new AuthController();

userRouter.post('/register', (req: Request, res: Response): Promise<Response> => {
    return authController.registerUser(req, res);
});

userRouter.post('/login', (req: Request, res: Response): Promise<Response> => {
    return authController.loginUser(req, res);
});

userRouter.post('/token', (req: Request, res: Response): Promise<Response> => {
    return authController.refreshToken(req, res);
});

userRouter.post('/checkEmail', (req: Request, res: Response): Promise<Response> => {
    return authController.checkEmailIsFree(req, res);
});

module.exports = userRouter;

