import { clientFetch } from "@/api/utils/clientFetch";
import { useMutation } from "@tanstack/react-query";

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
