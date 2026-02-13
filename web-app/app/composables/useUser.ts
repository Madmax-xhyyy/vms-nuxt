export function useUser() {
  const user = ref<TUser>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
  });

  function getData() {
    return $fetch<TUser>(`/api/user`, {
      method: "GET",
    })
  }

  function updateData(id: string, data: Partial<TUser>) {
    return $fetch<TUser>(`/api/user/id/${id}`, {
      method: "PATCH",
      body: data,
    })
  }

  return {
    user,
    getData,
    updateData
  }
}