const jwt = require("jsonwebtoken");

export class AuthService {
    constructor() {};

    generateToken(uuid: string): string {
        return jwt.sign(
                {
                    uuid: uuid,
                },
                    process.env.SECRET,
                {
                    expiresIn: process.env.tokenExpiration
                }
            );
    }

    generateRefreshToken(uuid: string): string {
        return jwt.sign(
                {
                    uuid: uuid,
                },
                    process.env.SECRET,
                {
                    expiresIn: process.env.refreshTokenExpiration
                }
            );
    }

}