import { ObjectId } from "mongodb";
import { logger } from "../utils/logger.util.js";
import { useAppointmentRepo } from "../repositories/appointment.repository.js";
import { modelAppoinment } from "../models/appointment.model.js";
import { modelPatientRecord } from "../models/patient.record.model.js";
import { usePatientRecordRepo } from "../repositories/patient.record.repository.js";
import { generateCode } from "../utils/generateCode.js";

export function useAppointmentService() {
  const {
    add: _add,
    getById: _getById,
    updateStatusById: _updateStatusById,
  } = useAppointmentRepo();

  const {
    findByEmail: _findPatientByEmail,
    add: _addPatient,
    update: _updatePatient,
  } = usePatientRecordRepo();

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
  async function updateStatusById(id, status) {

    const appointment = await _getById(id);
    if (!appointment) {
      throw new Error("Appointment not found");
    }

    await _updateStatusById(id, status);

    if (status !== "Done") return;
    const visit = {
      appointmentId: appointment._id,
      services: appointment.services.filter(s => s && s.trim() !== ""),
      date: appointment.date,
      time: appointment.time,
      notes: "",
    };

    const patientRecord = await _findPatientByEmail(appointment.email);
    if (!patientRecord) {
      await _addPatient(
        modelPatientRecord({
          ownerName: appointment.fullName,
          ownerEmail: appointment.email,
          pets: [
            {
              petName: appointment.petName,
              petType: appointment.petType,
              petBreed: appointment.petBreed,
              petAge: appointment.petAge,
              history: [visit],
            },
          ],
        })
      );
      return;
    }

    const alreadyExists = patientRecord.pets.some(p =>
      p.history.some(h => h.appointmentId.equals(appointment._id))
    );

    if (alreadyExists) return;

    const pet = patientRecord.pets.find(
      p => p.petName === appointment.petName
    );

    if (!pet) {
      patientRecord.pets.push({
        petName: appointment.petName,
        petType: appointment.petType,
        petBreed: appointment.petBreed,
        petAge: appointment.petAge,
        history: [visit],
      });
    } else {
      pet.history.push(visit);
    }

    await _updatePatient(patientRecord);
  }


  return {
    add,
    updateStatusById,
  };
}
