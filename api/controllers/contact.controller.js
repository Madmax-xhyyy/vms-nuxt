import Joi from "joi";
import { useContactService } from "../services/contact.service.js";
import { BadRequestError } from "../utils/error.util.js";
import { sendContactInquiryEmail } from "../utils/email.js";
import { useSystemInfoRepo } from "../repositories/system.info.repository.js";

export function useContactController() {
  const { createContact: _createContact } = useContactService();
  const { get: getSystemInfo } = useSystemInfoRepo();

  async function create(req, res, next) {
    const validation = Joi.object({
      fullName: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().allow("").optional(),
      message: Joi.string().required(),
    });

    const { error } = validation.validate(req.body);

    if (error) {
      return next(new BadRequestError(error.details.map(d => d.message).join(", ")));
    }

    try {
      const result = await _createContact(req.body);

      // Fetch clinic email from system info
      const systemInfo = await getSystemInfo();
      const clinicEmail = systemInfo?.email || process.env.BREVO_USER;

      // Send email inquiry
      await sendContactInquiryEmail({
        to: clinicEmail,
        senderName: req.body.fullName,
        senderEmail: req.body.email,
        senderPhone: req.body.phone,
        message: req.body.message,
      });

      res.status(201).json({
        message: "Message sent successfully",
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  return { create };
}
