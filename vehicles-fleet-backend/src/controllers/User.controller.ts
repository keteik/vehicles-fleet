import { Request, Response } from "express";
import { User } from "../entity/User";
import userService  from "../services/User.service";
import authService from "../services/Auth.service";
import { DeleteResult, UpdateResult } from "typeorm";

const bcrypt = require("bcrypt");
const uuid = require("uuid");

interface TokenData {
    uuid: string;
    token: string;
    refreshToken: string
}

export class UserController {

    async getUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users: User [] = await userService.getAllUsers();

            return res.status(200).send(users);
        } catch(err) {
            return res.status(500).send(err);
        }
    }

     async getUser(req: Request, res: Response): Promise<Response> {
         const id: string = req.params.id;
         
         if(!id) {
             return res.status(400).send( {status: "failed", message: "User id not specified"} );
         }

         try {
             const user: User | undefined = await userService.getUserById(id);

             if(!user) {
                 res.status(404).send( {status: "failed", message: "User not found"} );
             }

             return res.status(200).send( {status: "success", user} );
         } catch(err) {
             return res.status(500).send( {status: "failed", err} );
         }
     }

     async createUser(req: Request, res: Response): Promise<Response> {
        const newUserBody: User = req.body;

        if(!(newUserBody.email && newUserBody.password))
            return res.status(400).send( {status: "failed", message: "Invaid input!"} );

        try{
            const checkIfUserExists: User | undefined = await userService.getUserByEmail(newUserBody.email);

            if(checkIfUserExists !== undefined) {
                return res.status(409).send( {status: "failed", message: "User already exists!"} );
            }
    
            const salt = await bcrypt.genSalt(10);
            newUserBody.password = await bcrypt.hash(newUserBody.password, salt); 
            newUserBody.uuid = uuid.v4();

            //generate toekn and refresh token
            const token: string = authService.generateToken(newUserBody.uuid);
            const refreshToken: string = authService.generateRefreshToken(newUserBody.uuid);

            //save user
            newUserBody.refreshToken = refreshToken;
            const newUser: User = await userService.saveUser(newUserBody);    

            //response
            const data: TokenData = {
                uuid: newUser.uuid,
                token: token,
                refreshToken: refreshToken
            }

            return res.status(201).send( {status: "success", data: data});
        } catch(err) {
            return res.status(500).send( {status: "failed", err} );
        }
     }

     async updateUser(req: Request, res: Response): Promise<Response> {
        const id: string = req.params.id;
        
        if(!id)
            return res.status(400).send( {status: "failed", message: "User id not specified"} );

        const userBody: {
            name: string;
            email: string;
            password: string
        } = req.body;

        console.log(userBody);

        if(!(userBody.email || userBody.name || userBody.password))
            return res.status(400).send( {status: "failed", message: "Invaid input!"} );

        try{
            await userService.updateUserById(id, userBody);

            return res.status(200).send( {status: "success"} );
        } catch(err) {
            return res.status(500).send( {status: "failed", err} );
        }
     }

    async deleteUser(req: Request, res: Response): Promise<Response> {
        const id: string = req.params.id;

        if(!id)
            return res.status(400).send( {status: "failed", message: "User id not spiecified"} );

        try{
            await userService.deleteUser(id);

            return res.status(200).send( {status: "success"} );
        } catch(err) {
            return res.status(500).send( {status: "failed", err} );
        }
    }
};