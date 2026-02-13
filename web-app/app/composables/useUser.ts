export function useUser() {
  const user = ref<TUser>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
  });

  function getData() {
    return $fetch<Record<string, any>>(`/api/user`, {
      method: "GET",
    })
  }

  function updateData() {
    return $fetch<Record<string, any>>(`/api/user`, {
      method: "PATCH",
      body: user.value,
    })
  }

  return {
    user,
    getData,
    updateData
  }
}