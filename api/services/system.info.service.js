import { useSystemInfoRepo } from "../repositories/system.info.repository.js";
import { logger } from "../utils/logger.util.js";

export function useSystemInfoService() {
  const { get, upsert } = useSystemInfoRepo();

  async function addDefaultSystemInfo() {
    try {
      const existingInfo = await get();
      if (existingInfo) {
        console.log("[Setup] System information already exists.");
        logger.log({
          level: "info",
          message: "System information already exists.",
        });
        return;
      }

      const defaultData = {
        clinicName: "VMS Veterinary Clinic",
        tagline: "Quality Care for Your Furry Friends",
        description: "A full-service veterinary clinic dedicated to providing the best care for pets.",
        email: "contact@vmsclinic.com",
        phone: "+1 (555) 123-4567",
        address: "123 Pet Lane, Animal City, AC 12345",
        operatingHours: [
          { day: "Monday", open: "08:00 AM", close: "05:00 PM", isClosed: false },
          { day: "Tuesday", open: "08:00 AM", close: "05:00 PM", isClosed: false },
          { day: "Wednesday", open: "08:00 AM", close: "05:00 PM", isClosed: false },
          { day: "Thursday", open: "08:00 AM", close: "05:00 PM", isClosed: false },
          { day: "Friday", open: "08:00 AM", close: "05:00 PM", isClosed: false },
          { day: "Saturday", open: "09:00 AM", close: "01:00 PM", isClosed: false },
          { day: "Sunday", open: "", close: "", isClosed: true },
        ],
        footerText: "© 2026 VMS Veterinary Clinic. All rights reserved.",
        privacyPolicy: "Privacy policy details here...",
        termsAndConditions: "Terms and conditions details here...",
      };

      await upsert(defaultData);

      console.log("[Setup] Successfully created default system info.");
      logger.log({
        level: "info",
        message: "Successfully created default system info.",
      });
    } catch (error) {
      throw new Error(`Failed to create default system info: ${error.message}`);
    }
  }

  return { addDefaultSystemInfo };
}
