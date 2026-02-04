export function usePatientRecord() {
  const patientRecord = ref<TPatientRecord>({
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    ownerAddress: "",
    status: "",
    pets: [],
  });

  function getAllPatientRecords({ page = 1, limit = 10, status = "active", search = "" } = {}) {
    return $fetch<Record<string, any>>(`/api/patient-records`, {
      method: "GET",
      query: {
        page,
        limit,
        status,
        search,
      },
    });
  }

  function getById(id: string) {
    return $fetch<Record<string, any>>(`/api/patient-records/id/${id}`, {
      method: "GET",
    });
  }

  function deleteById(id: string) {
    return $fetch<Record<string, any>>(`/api/patient-records/id/${id}`, {
      method: "DELETE",
    });
  }

  return {
    getAllPatientRecords,
    getById,
    deleteById,
    patientRecord,
  }
}
