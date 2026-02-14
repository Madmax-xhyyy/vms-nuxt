import { DEFAULT_USER_EMAIL, DEFAULT_USER_PASSWORD } from "../config.js";
import { useUserRepo } from "../repositories/user.repository.js";
import { hashPassword } from "../utils/hash-password.util.js";
import { logger } from "../utils/logger.util.js";
import { ObjectId } from "mongodb";

export function useUserService() {
  const { add, getByEmail, updateById } = useUserRepo();

  async function addDefaultUser() {
    try {
      const existingUser = await getByEmail(DEFAULT_USER_EMAIL);
      const hashedPassword = await hashPassword(DEFAULT_USER_PASSWORD);
      const userData = {
        firstName: "Iam",
        middleName: "the",
        lastName: "Admin",
        password: hashedPassword,
        email: DEFAULT_USER_EMAIL,
        role: "admin",
        status: "active",
      };

      if (existingUser) {
        await updateById(existingUser._id, userData);
        logger.log({
          level: "info",
          message: "Default user synchronized.",
        });
        return;
      }

      await add({
        _id: new ObjectId(),
        ...userData
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