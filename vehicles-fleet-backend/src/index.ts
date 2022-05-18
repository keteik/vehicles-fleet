import express = require('express');
import { createConnection } from 'typeorm';
import { Auth } from './middleware/Auth';

const dbConfing = require('../ormconfig');
const userRouter = require('./routes/user');
const homeRouter = require('./routes/home');
const vehicleRouter = require('./routes/vehicle');

const auth = new Auth();
const app = express();

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use('/api', userRouter);
app.use(auth.verifyToken);
app.use('/api', homeRouter);
app.use('/api', vehicleRouter);

createConnection(dbConfing.config).then(async(): Promise<void> => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running at port ${process.env.PORT}...`);
    })
}).catch(error => console.log(error));
