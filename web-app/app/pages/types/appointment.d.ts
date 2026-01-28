declare type TAppointment = {
  _id?: string;
  code?: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  petName: string;
  petType: PetType;
  petBreed: string;
  petAge: string;
  services: string[];
  date: string;
  time: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

type PetType =
  | "Dog"
  | "Cat"
  | "Rabbit"
  | "Bird"
  | "Guinea Pig"
  | "Other"
  | null