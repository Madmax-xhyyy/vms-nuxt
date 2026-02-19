declare type TVisit = {
  appointmentId: string; // MongoDB ObjectId as string
  services: string[];
  dateTime?: string | Date;
  notes?: string;
};

declare type TPet = {
  petName: string;
  petType: PetType; // changed from string to PetType
  petBreed: string;
  petAge: string;
  history: TVisit[];
};

declare type TPatientRecord = {
  _id?: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerAddress: string;
  status: string;
  pets: TPet[];
  createdAt?: Date;
  updatedAt?: Date;
};