import express = require('express');
import { createConnection } from 'typeorm';
import { Auth } from './middleware/Auth';

const dbConfing = require('../ormconfig');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const vehicleRouter = require('./routes/vehicle');

const auth = new Auth();
const app = express();

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use(auth.verifyToken);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/vehicle', vehicleRouter);

createConnection(dbConfing.config).then(async(): Promise<void> => {
    app.listen(process.env.HTTP_PORT, () => {
        console.log(`HTTP server is running at port ${process.env.HTTP_PORT}!`);
    });
}).catch(error => console.log(error));
