import { Request, Response } from "express";
import { DeleteResult, UpdateResult } from "typeorm";
import { Vehice } from "../entity/Vehicle";
import  vehicleService  from "../services/Vehicle.service";

const uuid = require('uuid');

export class VehicleController {

    async getVehicles(req: Request, res: Response): Promise<Response> {
        try{
            const vehicles: Vehice[] = await vehicleService.getAllVehicles();

            return res.status(200).send({ status: "success", data: vehicles });
        } catch(err) {
            return res.status(500).send({ status: "failed", err});
        }
    }

    async getVehicle(req: Request, res: Response): Promise<Response> {
        const id: string = req.params.id;
        if(!id) {
            return res.status(400).send( {status: "failed", message: "User id not specified"} );
        }

        try {
            const vehicle: Vehice | undefined = await vehicleService.getVehicleById(id);
            if(!vehicle)
                return res.status(404).send( {status: "failed", message: "User not found"} ); 
            
            return res.status(200).send( {status: "success", vehicle} );
        } catch(err) {
            return res.status(500).send( {status: "failed", err} );
        }
    }

    async createVehicle(req: Request, res: Response): Promise<Response> {
        const vehicleBody: Vehice = req.body;
        
        const checkVehicleBody = vehicleBody.type && vehicleBody.brand && vehicleBody.model && vehicleBody.sweptVolume &&
            vehicleBody.insuranceDate && vehicleBody.technicalExaminationDate;
        
            if(!checkVehicleBody){
            return res.status(400).send( {status: "failed", message: "Invaid input!"} );
        }

        vehicleBody.uuid = uuid.v4();

        try {
            const newVehicle = await vehicleService.saveVehicle(vehicleBody);
            
            return res.status(201).send( {status: "success", data: newVehicle});
        } catch(err) {
            return res.status(500).send( {status: "failed", err} );
        }
    }

    async updateVehicle(req: Request, res:Response): Promise<Response> {
        const vehicleId: string = req.params.id;
        if(!vehicleId){
            return res.status(400).send( {status: "failed", message: "User id not specified"} );
        }

        const vehicleBody: Vehice = req.body;
        const checkVehicleBody = vehicleBody.type || vehicleBody.brand || vehicleBody.model || vehicleBody.sweptVolume ||
            vehicleBody.insuranceDate || vehicleBody.technicalExaminationDate;

         if(!(checkVehicleBody)){
            return res.status(400).send( {status: "failed", message: "Invaid input!"} );
         }

        try {
            await vehicleService.updateVehiceById(vehicleId, vehicleBody);

            return res.status(200).send( {status: "success"} );
        } catch(err) {
            return res.status(500).send( {status: "failed", err} );
        }
    }

    async deleteVehicle(req: Request, res: Response): Promise<Response> {
        const vehicleId: string = req.params.id;
        if(!vehicleId){
            return res.status(400).send( {status: "failed", message: "User id not specified"} );
        }

        try {
            await vehicleService.deleteVehicle(vehicleId);
        
            return res.status(200).send( {status: "success"} );
        } catch(err) {
            return res.status(500).send(err);
        }
    }
}