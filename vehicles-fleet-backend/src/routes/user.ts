import { UserController } from "../controllers/User.controller"
import { Auth } from '../middleware/Auth';

const express = require('express');
const userRouter = express.Router();

const userController = new UserController();
const auth = new Auth();
userRouter
.get('/', userController.getUsers)
.get('/:id', userController.getUser)
.post('/', userController.createUser)
.put('/:id', userController.updateUser)
.delete('/:id', userController.deleteUser);

module.exports = userRouter;