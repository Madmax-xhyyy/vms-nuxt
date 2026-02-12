export function useSystemInfo() {

  const systemInfo = ref<TSystemInfo>({
    clinicName: "",
    tagline: "",
    description: "",
    email: "",
    phone: "",
    address: "",
    logoUrl: "",
    faviconUrl: "",
    primaryColor: "",
    secondaryColor: "",
    operatingHours: "",
    footerText: "",
    privacyPolicy: "",
    termsAndConditions: "",
  })

  function getData() {
    return $fetch<TSystemInfo>(`/api/system-info`, {
      method: "GET",
    })
  }

  function updateData(id: string, data: Partial<TSystemInfo>) {
    return $fetch<TSystemInfo>(`/api/system-info/id/${id}`, {
      method: "PATCH",
      body: data,
    })
  }

  return {
    systemInfo,
    getData,
    updateData
  }

}