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
    operatingHours: [],
    footerText: "",
    privacyPolicy: "",
    termsAndConditions: "",
  })

  async function getData() {
    const data = await $fetch<TSystemInfo>(`/api/system-info`, {
      method: "GET",
    })
    if (data) {
      systemInfo.value = data
    }
    return data
  }

  async function updateData(id: string, updatePayload: Partial<TSystemInfo>) {
    const data = await $fetch<TSystemInfo>(`/api/system-info/id/${id}`, {
      method: "PATCH",
      body: updatePayload,
    })
    if (data) {
      systemInfo.value = data
    }
    return data
  }

  return {
    systemInfo,
    getData,
    updateData
  }
}