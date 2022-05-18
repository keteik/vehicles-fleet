import { Request, Response } from "express";
import { UpdateResult } from "typeorm";
import { User } from "../entity/User";
import { AuthService } from "../services/Auth.service";
import { UserService } from "../services/User.service";

const bcrypt = require("bcrypt");
const uuid = require("uuid");

interface AuthResponse {
    uuid: string;
    token: string;
    refreshToken: string
}

export class AuthController {   
    private userService: UserService;
    private authService: AuthService;
    
    constructor() {
        this.userService = new UserService();
        this. authService = new AuthService();
    };

    async checkEmailIsFree(req: Request, res: Response): Promise<Response> {
        const typedEmail: string = req.body.email;

        if(!typedEmail)
            return res.status(400).send("Invaid input!");

        try {
            const checkIfEmailExists: User | undefined = await this.userService.getUserByEmail(typedEmail);

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

    async registerUser(req: Request, res: Response): Promise<Response> {
        const newUserBody: User = req.body;

        if(!(newUserBody.email && newUserBody.password))
            return res.status(400).send("Invaid input!");

        try{
            const checkIfUserExists: User | undefined = await this.userService.getUserByEmail(newUserBody.email);

            if(checkIfUserExists !== undefined) {
                return res.status(409).send("User already exists!");
            }
    
            const salt = await bcrypt.genSalt(10);
            newUserBody.password = await bcrypt.hash(newUserBody.password, salt); 
            newUserBody.uuid = uuid.v4();

            //generate toekn and refresh token
            const token: string = this.authService.generateToken(newUserBody.uuid);
            const refreshToken: string = this.authService.generateRefreshToken(newUserBody.uuid);

            //save user
            newUserBody.refreshToken = refreshToken;
            const newUser: User = await this.userService.saveUser(newUserBody);    

            //response
            const registerResponse: AuthResponse = {
                uuid: newUser.uuid,
                token: token,
                refreshToken: refreshToken
            }

            return res.status(201).send(registerResponse);

        } catch(err) {
            return res.status(500).send(err);
        }
    }

    async loginUser(req: Request, res: Response): Promise<Response> {
        const userBody: User = req.body;

        if(!(userBody.password && userBody.email))
            return res.status(400).send("Invalid input!");
        
        try {
            const findUser: User | undefined =  await this.userService.getUserByEmail(userBody.email);
        
            if(findUser === undefined) 
                return res.status(404).send("User does not exists!");  

            const checkPassword: string = await bcrypt.compare(userBody.password, findUser.password);

            if(!checkPassword) 
                return res.status(401).send("Password is incorrect!");

            //generate toekn and refresh token
            const token: string = this.authService.generateToken(findUser.uuid);
            const refreshToken: string = this.authService.generateRefreshToken(findUser.uuid);

            //update refresh token on user
            const user: UpdateResult  = await this.userService.updateUserById(findUser.uuid, {
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
            const findUser: User | undefined = await this.userService.getUserById(tokenData.uuid);
            if(findUser === undefined)
                return res.status(404).send("User not found"!);

            if(tokenData.refreshToken !== findUser.refreshToken)
                return res.status(401).send("Refresh token is invalid!");

            //generate refresh toekn
            const newToken: string = this.authService.generateToken(findUser.uuid);

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