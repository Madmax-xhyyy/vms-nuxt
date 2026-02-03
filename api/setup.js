import { useUserRepo } from "./repositories/user.repository.js";
import { useAppointmentRepo } from "./repositories/appointment.repository.js";
import { usePatientRecordRepo } from "./repositories/patient.record.repository.js";
import { useRedis } from "./utils/redis-client.util.js";
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from "./config.js";
import { useUserService } from "./services/user.service.js";
import { logger } from "./utils/logger.util.js";

export default async function setup() {
  try {
    await useRedis().init({
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD,
    });
  } catch (error) {
    console.log("Failed to connect to Redis server.");
    logger.log({ level: "error", message: error.message });
  }

  const { createUserIndexes } = useUserRepo();
  const { createAppointmentIndexes } = useAppointmentRepo();
  const { createPatientRecordIndexes } = usePatientRecordRepo();

  try {
    const results = await Promise.all([
      createUserIndexes(),
      createAppointmentIndexes(),
      createPatientRecordIndexes(),
    ]);
    results.forEach(message => logger.log({ level: "info", message }));
  } catch (error) {
    logger.log({ level: "error", message: error.message });
  }

  const { addDefaultUser } = useUserService();
  try {
    await addDefaultUser();
  } catch (error) {
    logger.log({ level: "error", message: error });
  }
}