import { clientFetch } from "@/api/utils/clientFetch";
import { useMutation } from "@tanstack/react-query";

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
