import { clientFetch } from "@/api/utils/clientFetch";
import { useQuery } from "@tanstack/react-query";

export const useGetHealthCheck = () => useQuery({
  queryKey: ['health'],
  queryFn: async () => {
    return await clientFetch('/api/health', {
      method: "GET",
      credentials: "include",
    });
  }
});
