const jwt = require("jsonwebtoken");

class AuthService {
    constructor() {};

    generateToken(uuid: string): string {
        return jwt.sign({
            uuid: uuid,
        }, process.env.SECRET, {
            expiresIn: process.env.TOKEN_EXPIRATION
        });
    }

    generateRefreshToken(uuid: string): string {
        return jwt.sign({
            uuid: uuid,
        }, process.env.SECRET, {
            expiresIn: process.env.TOKEN_EXPIRATION
        });
    }
}

export default new AuthService();