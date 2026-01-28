export function useAppointment() {
  const appointment = ref<TAppointment>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    petName: "",
    petType: null,
    petBreed: "",
    petAge: "",
    services: [],
    date: "",
    time: "",
  });

  const petTypeOptions = {
    Dog: ["Labrador Retriever", "Golden Retriever", "Beagle", "Pomeranian", "Shih Tzu", "Chihuahua", "French Bulldog", "Pug", "Dachshund"],
    Cat: ["Persian", "Siamese", "Maine Coon", "Ragdoll", "British Shorthair", "Scottish Fold", "Sphynx", "Bengal", "American Shorthair"],
    Rabbit: ["Holland Lop", "Netherland Dwarf"],
    Bird: ["Parakeet", "Cockatiel", "Lovebird"],
    "Guinea Pig": ["Abyssinian", "American"],
    Other: [] as string[]
  };

  const services = [
    'General Check-Up', 'Vaccination', 'Deworming', 'Grooming', 'Consultation',
    'Surgery', 'Dental Care', 'Laboratory Tests', 'Emergency Care',
    'Spay / Neuter', 'Parasite Control', 'Pet Boarding', 'Health Certificate'
  ];


  const petTypeKeys = Object.keys(petTypeOptions) as (keyof typeof petTypeOptions)[];

  const petBreeds = (type: PetType) => {
    if (!type) return [];
    return petTypeOptions[type];
  };

  function getAllPendingAppointments({ page = 1, limit = 10, search = "" } = {}) {
    return $fetch<Record<string, any>>(`/api/appointments/status/pending`, {
      method: "GET",
      query: {
        page,
        limit,
        search,
        status: "Pending",
      },
    });
  }

  function getAllAppointments({ page = 1, limit = 10, search = "", status = "Approved" } = {}) {
    return $fetch<Record<string, any>>(`/api/appointments/status/${status}`, {
      method: "GET",
      query: {
        page,
        limit,
        search,
      },
    });
  }

  function getById(id: string) {
    return $fetch<TAppointment>(`/api/appointments/id/${id}`, {
      method: "GET",
    });
  }

  function updateStatusById(id: string, status: string) {
    return $fetch<TAppointment>(`/api/appointments/id/${id}/status/${status}`, {
      method: "PATCH",
    });
  }

  return {
    appointment,
    petTypeOptions,
    petTypeKeys,
    petBreeds,
    services,
    getAllPendingAppointments,
    getById,
    updateStatusById,
    getAllAppointments,
  };
}