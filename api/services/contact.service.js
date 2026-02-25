import { useContactRepository } from "../repositories/contact.repository.js";

export function useContactService() {
  const { create: _create } = useContactRepository();

  async function createContact(data) {
    return await _create(data);
  }

  return { createContact };
}
