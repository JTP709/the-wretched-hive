import { useMutation } from "@tanstack/react-query";

export const usePostSignUp = () => useMutation({
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

export const usePostCartItem = () => useMutation({
  mutationFn: async (productId: number) => {
    return await fetch('/api/cart', {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({
        productId,
        quantity: 1
      }),
      credentials: 'include',
    });
  },
});
