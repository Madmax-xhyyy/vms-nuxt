import { ObjectId } from "mongodb";
import { logger } from "../utils/logger.util.js";
import { useAppointmentRepo } from "../repositories/appointment.repository.js";
import { modelAppoinment } from "../models/appointment.model.js";
import { generateCode } from "../utils/generateCode.js";

export function useAppointmentService() {
  const { add: _add } = useAppointmentRepo();

  async function add(payload) {
    try {
      const appointment = modelAppoinment({
        _id: new ObjectId().toHexString(),
        code: generateCode(), // ✅ GENERATED HERE
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
        petName: payload.petName,
        petType: payload.petType,
        petBreed: payload.petBreed,
        petAge: payload.petAge,
        services: payload.services,
        date: payload.date,
        time: payload.time,
        status: "Pending",
        createdAt: new Date(),
      });

      await _add(appointment);

      logger.log({
        level: "info",
        message: `Appointment added successfully. Code: ${appointment.code}`,
      });

      return appointment;
    } catch (error) {
      throw new Error(`Failed to add appointment: ${error.message}`);
    }
  }

  return {
    add,
  };
}
