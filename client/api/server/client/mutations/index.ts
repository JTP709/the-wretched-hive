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
