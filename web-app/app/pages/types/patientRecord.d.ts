declare type TVisit = {
  appointmentId: string; // MongoDB ObjectId as string
  services: string[];
  date: string | Date;
  time: string;
  notes?: string;
};

declare type TPet = {
  petName: string;
  petType: string; // could also be enum like PetType
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