import { clientFetch } from "@/api/utils/clientFetch";
import { useMutation } from "@tanstack/react-query";

export const useCreateCartItem = () => useMutation({
  mutationFn: async (productId: number) => {
    return await clientFetch("/api/cart", {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({
        productId,
      }),
      credentials: "include",
    });
  },
});

export const useUpdateCartItemQuantity = () => useMutation({
  mutationFn: async ({ cartId, quantity }: { cartId: number; quantity: number }) => {
    return await clientFetch(`/api/cart/${cartId}`, {
      method: "PUT",
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({ quantity }),
      credentials: 'include',
    });
  },
});