import { ObjectId } from "mongodb";
import { logger } from "../utils/logger.util.js";
import { useAppointmentRepo } from "../repositories/appointment.repository.js";
import { modelAppoinment } from "../models/appointment.model.js";
import { modelPatientRecord } from "../models/patient.record.model.js";
import { usePatientRecordRepo } from "../repositories/patient.record.repository.js";
import { generateCode } from "../utils/generateCode.js";
import { sendAppointmentConfirmationEmail } from "../utils/email.js";

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
        code: generateCode(),
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
        petName: payload.petName,
        petType: payload.petType,
        petBreed: payload.petBreed,
        petAge: payload.petAge,
        services: payload.services,
        dateTime: payload.dateTime,
        status: "Pending",
        createdAt: new Date(),
      });

      // Save to DB
      await _add(appointment);

      logger.info(`Appointment added successfully. Code: ${appointment.code}`);

      // Send confirmation email (fire-and-forget)
      sendAppointmentConfirmationEmail({
        to: appointment.email,
        fullName: appointment.fullName,
        code: appointment.code,
        dateTime: appointment.dateTime,
      }).catch((err) =>
        logger.error(`Failed to send email to ${appointment.email}: ${err.message}`)
      );

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
      dateTime: appointment.dateTime,
      notes: "",
    };

    const patientRecord = await _findPatientByEmail(appointment.email);
    if (!patientRecord) {
      await _addPatient(
        modelPatientRecord({
          ownerName: appointment.fullName,
          ownerEmail: appointment.email,
          ownerPhone: appointment.phone,
          ownerAddress: appointment.address,
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
