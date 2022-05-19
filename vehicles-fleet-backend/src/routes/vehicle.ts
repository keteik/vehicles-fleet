import { Request, Response } from "express";
import { VehicleController } from "../controllers/Vehicle.controller";


const express = require('express');

const vehicleRouter = express.Router();
const vehicleController = new VehicleController();

vehicleRouter
.get('/vehicle', (req: Request, res: Response): Promise<Response> => {
    return vehicleController.getVehicles(req, res);
})
.post('/vehicle', (req: Request, res: Response): Promise<Response> => {
    return vehicleController.createVehicle(req, res);
})
.put('/vehicle', (req: Request, res: Response): Promise<Response> => {
    return vehicleController.updateVehicle(req, res);
})
.delete('/vehicle', (req: Request, res: Response): Promise<Response> => {
    return vehicleController.deleteVehicle(req, res);
});

module.exports = vehicleRouter;