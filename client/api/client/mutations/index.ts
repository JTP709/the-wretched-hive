import { useMutation } from "@tanstack/react-query";

export const useLogin = () => useMutation({
  mutationFn: async ({ username, password }: { username: string; password: string; }) => {
    return await fetch("/api/auth/login", {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({ username, password }),
    });
  }
});

export const useSignUp = () => useMutation({
  mutationFn: async ({ username, password }: { username: string; password: string; }) => {
    return await fetch("http://localhost:4000/api/auth/signup",{
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({
        username,
        password
      }),
    });
  },
});

export const useLogout = () => useMutation({
  mutationFn: async () => {
    return await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  },
});

export const useCreateCartItem = () => useMutation({
  mutationFn: async (productId: number) => {
    return await fetch("/api/cart", {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({
        productId,
        quantity: 1
      }),
      credentials: "include",
    });
  },
});

export const useUpdateCartItemQuantity = () => useMutation({
  mutationFn: async ({ cartId, quantity }: { cartId: number; quantity: number }) => {
    return await fetch(`http://localhost:4000/api/cart/${cartId}`, {
      method: "PUT",
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({ quantity }),
      credentials: 'include',
    });
  },
});

export const useCheckout = () => useMutation({
  mutationFn: async (formData: { [k: string]: FormDataEntryValue; }) => {
    return await fetch('/api/checkout', {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify(formData),
      credentials: "include",
    });
  },
});
