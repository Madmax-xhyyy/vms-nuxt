import { DEFAULT_USER_EMAIL, DEFAULT_USER_PASSWORD } from "../config.js";
import { useUserRepo } from "../repositories/user.repository.js";
import { hashPassword } from "../utils/hash-password.util.js";
import { logger } from "../utils/logger.util.js";

export function useUserService() {
  const { add, getByEmail } = useUserRepo();

  async function addDefaultUser() {
    try {
      const existingUser = await getByEmail(DEFAULT_USER_EMAIL);
      if (existingUser) {
        logger.log({
          level: "info",
          message: "Default user already exists.",
        });
        return;
      }

      const hashedPassword = await hashPassword(DEFAULT_USER_PASSWORD);
      await add({
        firstName: "Iam",
        lastName: "Admin",
        password: hashedPassword,
        email: DEFAULT_USER_EMAIL,
        role: "admin",
        status: "active",
      });

      logger.log({
        level: "info",
        message: "Successfully created default user.",
      });
    } catch (error) {
      throw new Error(`Failed to create default user: ${error.message}`);
    }
  }

  return { addDefaultUser };
}