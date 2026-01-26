import Joi from "joi";
import { useAuthService } from "../services/auth.service.js";
import { BadRequestError } from "../utils/error.util.js";
import { DOMAIN } from "../config.js";

export function useAuthController() {
  const { login: _login } = useAuthService();

  async function login(req, res, next) {
    const validation = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(4).required(),
    });

    const { error } = validation.validate(req.body);

    if (error) {
      next(new BadRequestError(error.details));
    }

    try {
      const data = await _login(req.body);

      // Set session cookie
      res.cookie("sid", data.sid, {
        domain: DOMAIN,
        secure: true,
        maxAge: 30 * 24 * 60 * 60,
      });

      res.json({ message: "Login successful", user: data.user });
    } catch (error) {
      next(error);
      return;
    }
  }

  return { login };
}