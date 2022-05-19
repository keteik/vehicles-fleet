import { Request, Response, NextFunction } from "express";

const jwt = require('jsonwebtoken');

enum Roles {
    User,
    Admin
}

export class Auth {
    constructor() {};

    verifyToken(req: Request, res: Response, next: NextFunction): void {
        const bearerHeader: string | undefined = req.headers['authorization'];
        if(res.locals.skip)
            next();

        if(!bearerHeader) {
            res.status(403).send("Not authenticated");
        } else {
            try {
                const token = bearerHeader.split(' ')[1];
                const decoded = jwt.verify(token, process.env.SECRET);

                if(decoded) {
                    next();    
                }
            } catch(err){
                res.status(500).send(err);
            }
        }
    }
}