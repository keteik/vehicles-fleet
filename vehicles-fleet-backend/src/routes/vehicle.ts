import { Request, Response } from "express";
import { VehicleController } from "../controllers/Vehicle.controller";


const express = require('express');

const vehicleRouter = express.Router();
const vehicleController = new VehicleController();

vehicleRouter
    .get('/', vehicleController.getVehicles)
    .get('/:id', vehicleController.getVehicle)
    .post('/', vehicleController.createVehicle)
    .put('/:id', vehicleController.updateVehicle)
    .delete('/:id', vehicleController.deleteVehicle);

    // .post('/vehicle', (req: Request, res: Response): Promise<Response> => {
//     return vehicleController.createVehicle(req, res);
// })
// .put('/', (req: Request, res: Response): Promise<Response> => {
//     return vehicleController.updateVehicle(req, res);
// })
// .delete('/vehicle', (req: Request, res: Response): Promise<Response> => {
//     return vehicleController.deleteVehicle(req, res);
// });

module.exports = vehicleRouter;