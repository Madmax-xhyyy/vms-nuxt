import { useUserRepo } from "./repositories/user.repository.js";
import { useAppointmentRepo } from "./repositories/appointment.repository.js";
import { usePatientRecordRepo } from "./repositories/patient.record.repository.js";
import { useSystemInfoRepo } from "./repositories/system.info.repository.js";
import { useRedis } from "./utils/redis-client.util.js";
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from "./config.js";
import { useUserService } from "./services/user.service.js";
import { useSystemInfoService } from "./services/system.info.service.js";
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
  const { createSystemInfoIndexes } = useSystemInfoRepo();

  try {
    const results = await Promise.all([
      createUserIndexes(),
      createAppointmentIndexes(),
      createPatientRecordIndexes(),
      createSystemInfoIndexes(),
    ]);
    results.forEach(message => {
      console.log(`[Setup] ${message}`);
      logger.log({ level: "info", message });
    });
  } catch (error) {
    logger.log({ level: "error", message: error.message });
  }

  const { addDefaultUser } = useUserService();
  const { addDefaultSystemInfo } = useSystemInfoService();
  try {
    await Promise.all([
      addDefaultUser(),
      addDefaultSystemInfo(),
    ]);
  } catch (error) {
    console.error("[Setup Error]", error.message || error);
    logger.log({ level: "error", message: error });
  }
}