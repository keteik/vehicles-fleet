import {Request, Response} from 'express';

const express = require('express');

const home = express.Router();

home.get('/home', (req: Request, res: Response): void => {
    res.status(200).send("Hello ");
})

module.exports = home;