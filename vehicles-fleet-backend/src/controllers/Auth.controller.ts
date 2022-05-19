import { Request, Response } from "express";
import { UpdateResult } from "typeorm";
import { User } from "../entity/User";
import  authService  from "../services/Auth.service";
import  userService  from "../services/User.service";

const bcrypt = require("bcrypt");
const uuid = require("uuid");


interface AuthResponse {
    uuid: string;
    token: string;
    refreshToken: string
}

export class AuthController {   

    async checkEmailIsFree(req: Request, res: Response): Promise<Response> {
        const typedEmail: string = req.body.email;

        if(!typedEmail)
            return res.status(400).send("Invaid input!");

        try {
            const checkIfEmailExists: User | undefined = await userService.getUserByEmail(typedEmail);

            if(checkIfEmailExists !== undefined) {
                return res.status(409).send(
                    { 
                        status: false,
                        message: "Email already exists!"
                    }
                );
            }

            return res.status(200).send(
                { 
                    status: true,
                    message: "Email is free!"
                }
            );
        } catch(err) {
            return res.status(500).send(err);
        }
    }

    async loginUser(req: Request, res: Response): Promise<Response> {
        const userBody: User = req.body;

        if(!(userBody.password && userBody.email))
            return res.status(400).send("Invalid input!");

        try {
            const findUser: User | undefined =  await userService.getUserByEmail(userBody.email);

            if(findUser === undefined) 
                return res.status(404).send("User does not exists!");  

            const checkPassword: string = await bcrypt.compare(userBody.password, findUser.password);

            if(!checkPassword) 
                return res.status(401).send("Password is incorrect!");
            
            //generate toekn and refresh token
            const token: string = authService.generateToken(findUser.uuid);
            const refreshToken: string = authService.generateRefreshToken(findUser.uuid);

            //update refresh token on user
            const user: UpdateResult  = await userService.updateUserById(findUser.uuid, {
                refreshToken: refreshToken 
            });

            //response
            const loginResponse: AuthResponse = {
                uuid: findUser.uuid,
                token: token,
                refreshToken: refreshToken
            }

            return res.status(200).send(loginResponse);

        } catch(err) {
            return res.status(500).send(err);
        }
    }

    async refreshToken(req: Request, res: Response): Promise<Response> {
        const tokenData: { uuid: string, refreshToken: string} = req.body;

        if(!(tokenData.uuid && tokenData.refreshToken))
            return res.status(400).send("Invalid input!");
        
        try {
            const findUser: User | undefined = await userService.getUserById(tokenData.uuid);
            if(findUser === undefined)
                return res.status(404).send("User not found"!);

            if(tokenData.refreshToken !== findUser.refreshToken)
                return res.status(401).send("Refresh token is invalid!");

            //generate refresh toekn
            const newToken: string = authService.generateToken(findUser.uuid);

            //response
            const refreshTokenResponse: AuthResponse = {
                uuid: findUser.uuid,
                token: newToken,
                refreshToken: findUser.refreshToken
            }
            
            return res.status(200).send(refreshTokenResponse);
            
        } catch(err) {
            return res.status(500).send(err);
        }
    }
}