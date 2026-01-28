// utils/generateAppointmentCode.js
export function generateCode() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();

  return `APT-${date}-${random}`;
}
