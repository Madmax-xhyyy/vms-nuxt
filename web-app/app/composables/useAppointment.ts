export function useAppointment() {
  const appointment = ref<TAppointment>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    petName: "",
    petType: "",
    petBreed: "",
    petAge: "",
    services: "",
    date: "",
    time: "",
    status: "",
  });

  function getAllPendingAppointments({ page = 1, limit = 10, search = "" } = {}) {
    return $fetch<Record<string, any>>(`/api/appointments/status/pending`, {
      method: "GET",
      query: {
        page,
        limit,
        search,
        status: "pending",
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
    getAllPendingAppointments,
    getById,
    updateStatusById,
    getAllAppointments,
  };
}