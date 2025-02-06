import { clientFetch } from "@/api/utils/apiFetch";
import { useMutation } from "@tanstack/react-query";

// Auth

export const useLogin = () => useMutation({
  mutationFn: async ({ username, password }: { username: string; password: string; }) => {
    return await clientFetch("/api/auth/login", {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({ username, password }),
    });
  }
});

export const useSignUp = () => useMutation({
  mutationFn: async (userData: SignUpFormRequest) => {
    return await clientFetch("/api/auth/signup",{
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify(userData),
    });
  },
});

export const useLogout = () => useMutation({
  mutationFn: async () => {
    return await clientFetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  },
});

export const useForgotPassword = () => useMutation({
  mutationFn: async ({ email }: { email: string; }) => {
    return await clientFetch("/api/auth/forgot-password", {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({ email }),
    });
  },
});

export const useResetPassword = () => useMutation({
  mutationFn: async ({ password, token }: { password: string; token: string; }) => {
    return await clientFetch("/api/auth/reset-password", {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({ password, token }),
    });
  },
});

// Cart

export const useCreateCartItem = () => useMutation({
  mutationFn: async (productId: number) => {
    return await clientFetch("/api/cart", {
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
    return await clientFetch(`/api/cart/${cartId}`, {
      method: "PUT",
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({ quantity }),
      credentials: 'include',
    });
  },
});

// Checkout

export const useCheckout = () => useMutation({
  mutationFn: async (formData: { [k: string]: FormDataEntryValue; }) => {
    return await clientFetch('/api/checkout', {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify(formData),
      credentials: "include",
    });
  },
});
