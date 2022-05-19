import { Request, Response } from "express";
import { DeleteResult, UpdateResult } from "typeorm";
import { Vehice } from "../entity/Vehicle";
import { VehiceService } from "../services/Vehicle.service";

const uuid = require('uuid');

export class VehicleController {
    private vehicleService: VehiceService;

    constructor() {
        this.vehicleService = new VehiceService();
    };

    async createVehicle(req: Request, res: Response): Promise<Response> {
        const vehicleBody: Vehice = req.body;

        if(!(vehicleBody.type && vehicleBody.brand && vehicleBody.model && vehicleBody.sweptVolume &&  
                    vehicleBody.insuranceDate &&  vehicleBody.technicalExaminationDate)) {
            return res.status(400).send("Invaid input!");
        }

        vehicleBody.uuid = uuid.v4();

        try {
            const newVehicle = await this.vehicleService.saveVehicle(vehicleBody);
            
            return res.status(201).send(newVehicle);
        } catch(err) {
            return res.status(500).send(err);
        }
    }

    async getVehicles(req: Request, res: Response): Promise<Response> {
        try{
            const vehicles: Vehice[] = await this.vehicleService.getAllVehicles();

            return res.status(200).send(vehicles);
        } catch(err) {
            return res.status(500).send(err);
        }
    }

    async updateVehicle(req: Request, res:Response): Promise<Response> {
        const vehicleBody: {
            type: string;
            brand: string;
            model: string;
            sweptVolume: string;
            insuranteDate: Date;
            technicalExaminationDate: Date
        } = req.body;

        const vehicleId: string = req.body.uuid

        if(!(vehicleId)){
            return res.status(400).send("Invaid input!");
        }

        try {
            const updatedVehicle: UpdateResult = await this.vehicleService.updateVehiceById(vehicleId, vehicleBody);

            return res.status(200).send(updatedVehicle);
        } catch(err) {
            return res.status(500).send(err);
        }
    }

    async deleteVehicle(req: Request, res: Response): Promise<Response> {
        const vehicleId: string = req.body.uuid;

        if(!vehicleId) {
            res.status(400).send("Invalid input!");
        }

        try {
            const deletedVehicle: DeleteResult = await this.vehicleService.deleteVehicle(vehicleId);
        
            return res.status(200).send(deletedVehicle);
        } catch(err) {
            return res.status(500).send(err);
        }
    }
}

