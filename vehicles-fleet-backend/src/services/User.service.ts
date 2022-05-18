import {getManager, UpdateResult} from "typeorm";
import { User } from "../entity/User";

export class UserService {

    constructor() {};

    getUserById(uuid: string): Promise<User | undefined>{
        return User.findOne({
            where: {
                uuid: uuid
            }
        });
    }

    getUserByEmail(email: string): Promise<User | undefined> {
        return User.findOne({ email: email });
    }

    saveUser(user: User): Promise<User> {
        return User.create(user).save();
    }

    updateUserById(uuid: string, value: Object): Promise<UpdateResult> {
        return User.update({ uuid: uuid }, value);
    }
}