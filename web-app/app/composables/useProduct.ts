export function useProduct() {
  const product = ref<TProduct>({
    name: "",
    price: 0,
    category: "",
    stock: 0,
    image: "",
    status: "",
  });

  function getAll({ page = 1, limit = 10, status = "active", search = "" } = {}) {
    return $fetch<Record<string, any>>(`/api/products`, {
      method: "GET",
      query: {
        page,
        limit,
        status,
        search,
      },
    });
  }

  function updateById(id: string, data: Partial<TProduct>) {
    return $fetch<Record<string, any>>(`/api/products/id/${id}`, {
      method: "PATCH",
      body: data,
    });
  }

  function deleteById(id: string) {
    return $fetch<Record<string, any>>(`/api/products/id/${id}`, {
      method: "DELETE",
    });
  }



  return {
    product,
    getAll,
    updateById,
    deleteById
  }
}