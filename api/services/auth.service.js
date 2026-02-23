import Joi from "joi";
import { useUserRepo } from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { useCache } from "../utils/cache.util.js";
import { BadRequestError, NotFoundError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";
import { sendResetPasswordEmail } from "../utils/email.js";
import { hashPassword } from "../utils/hash-password.util.js";
import { DOMAIN } from "../config.js";

export function useAuthService() {
  const { getByEmail, updateById } = useUserRepo();
  const { setCache, getCache, delCache } = useCache("sessions");
  const { setCache: setResetCache, getCache: getResetCache, delCache: delResetCache } = useCache("reset-tokens");

  async function login({ email, password } = {}) {
    // Validate credentials using schema
    const validation = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(4).required(),
    });

    const { error } = validation.validate({ email, password });
    if (error) {
      throw new BadRequestError(error.details);
    }

    try {
      // Get user by email to check if user exists
      const user = await getByEmail(email);

      if (!user) {
        throw new NotFoundError("Invalid email.");
      }

      // If user exists, hash the password and compare it, else, return an error invalid email
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        throw new BadRequestError("Invalid password");
      }

      // If password matched, create session id
      const sid = uuidv4();
      // Store session id on redis database
      setCache(`sid:${sid}`, sid, 14400)
        .then(() => {
          logger.log({
            level: "info",
            message: `Set user ${user._id} session id`,
          });
        })
        .catch(() => {
          logger.log({
            level: "error",
            message: "Failed to create user session id",
          });
        });

      // Return user id
      return { sid, user: user._id };
    } catch (error) {
      throw error;
    }
  }

  async function comparePassword(password, hashPassword) {
    return new Promise((resolve) => {
      bcrypt.compare(password, hashPassword, (err, result) => {
        if (err) {
          resolve(false);
          return;
        }
        resolve(result);
        return;
      });
    });
  }

  async function forgotPassword(email) {
    const validation = Joi.string().email().required();
    const { error } = validation.validate(email);
    if (error) {
      throw new BadRequestError("Invalid email format");
    }

    const user = await getByEmail(email);
    if (!user) {
      // Don't reveal if user exists for security, or just throw 404 if it's internal admin only
      throw new NotFoundError("User not found");
    }

    const token = uuidv4();
    await setResetCache(`reset:${token}`, email, 3600); // 1 hour

    const link = `http://${DOMAIN === 'localhost' ? 'localhost:3000' : DOMAIN}/admin/reset-password?token=${token}`;
    await sendResetPasswordEmail({ to: email, fullName: user.fullName || email, link });

    return { message: "Reset link sent to email" };
  }

  async function resetPassword(token, newPassword) {
    const validation = Joi.object({
      token: Joi.string().required(),
      newPassword: Joi.string().min(4).required(),
    });

    const { error } = validation.validate({ token, newPassword });
    if (error) {
      throw new BadRequestError(error.details);
    }

    const email = await getResetCache(`reset:${token}`);
    if (!email) {
      throw new BadRequestError("Invalid or expired token");
    }

    const user = await getByEmail(email);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const hashed = await hashPassword(newPassword);

    // Pass the full user object to satisfy schemaUserUpdate validation
    const updatedUser = { ...user, password: hashed };
    delete updatedUser._id;

    await updateById(user._id, updatedUser);

    await delResetCache(`reset:${token}`);

    return { message: "Password updated successfully" };
  }

  return { login, forgotPassword, resetPassword };
}