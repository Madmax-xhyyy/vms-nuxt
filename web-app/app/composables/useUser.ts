export function useUser() {
  const { cookieConfig } = useRuntimeConfig().public;
  const currentUser = useState<TUser | null>("currentUser", () => null);
  const user = ref<TUser>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
  });

  function getById(id: string) {
    return $fetch<Record<string, any>>(`/api/user/id/${id}`, {
      method: "GET",
    });
  }

  function updateById(id: string, data: Partial<TUser>) {
    return $fetch<Record<string, any>>(`/api/user/id/${id}`, {
      method: "PATCH",
      body: data,
    });
  }

  async function getCurrentUser() {
    const user = useCookie("user", cookieConfig).value;
    if (!user) return null;
    try {
      const _user = await $fetch<TUser>(`/api/user/id/${user}`, {
        method: "GET",
      });

      currentUser.value = _user;
      return _user;
    } catch (error) {
      // Error is handled by the caller or ignored if appropriate
    }
  }

  return {
    user,
    currentUser,
    getCurrentUser,
    getById,
    updateById
  }
}