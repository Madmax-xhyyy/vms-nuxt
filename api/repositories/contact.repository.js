import { db } from "../index.js";
import { modelContact } from "../models/contact.model.js";

export function useContactRepository() {
  const collection = db.collection("contacts");

  async function create(data) {
    const contact = modelContact(data);
    await collection.insertOne(contact);
    return contact;
  }

  return { create };
}
