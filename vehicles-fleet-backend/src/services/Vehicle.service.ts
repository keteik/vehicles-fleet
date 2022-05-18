import { DeleteResult, UpdateResult } from "typeorm";
import { Vehice } from "../entity/Vehicle";

export class VehiceService {

    constructor() {};

    saveVehicle(vehicle: Vehice): Promise<Vehice> {
        return Vehice.create(vehicle).save();
    }

    getAllVehicles(): Promise<Vehice []> {
        return Vehice.find();
    }

    getVehicleById(uuid: number): Promise<Vehice | undefined> {
        return Vehice.findOne({
            where: {
                uuid: uuid
            }
        });
    }

    updateVehiceById(uuid: string, value: Object): Promise<UpdateResult> {
        return Vehice.update({ uuid: uuid }, value);
    }

    deleteVehicle(uuid: string): Promise<DeleteResult> {
        return Vehice.delete( {uuid: uuid} );
    }
}