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
    return $fetch<Record<string, any>>(`/api/system-info`, {
      method: "GET",
    })
  }

  function updateData() {
    return $fetch<Record<string, any>>(`/api/system-info`, {
      method: "PATCH",
      body: systemInfo.value,
    })
  }

  return {
    systemInfo,
    getData,
    updateData
  }
}