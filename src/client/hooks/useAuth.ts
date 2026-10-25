import { useMutation } from "@tanstack/react-query";
import { ErrorResSchema } from "../../server/common/schemas.ts";
import { api } from "../api";
import type { RouterInputs } from "../constants/routes";
import { toast } from "../utils/toast.ts";

export const useAuth = () => {
  const login = useMutation({
    mutationFn: async (input: RouterInputs["auth"]["login"]) => {
      const res = await api.auth.login.$post({ json: input });
      if (!res.ok) {
        const body: unknown = await res.json().catch(() => null);
        const parsed = ErrorResSchema.safeParse(body);
        throw new Error(parsed.success ? parsed.data.error : "Login failed");
      }
      return await res.json();
    },
    onSuccess: () => {
      window.location.reload();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      const res = await api.auth.logout.$post({});
      if (!res.ok) {
        const body: unknown = await res.json().catch(() => null);
        const parsed = ErrorResSchema.safeParse(body);
        throw new Error(parsed.success ? parsed.data.error : "Logout failed");
      }
      return await res.json();
    },
    onSuccess: () => {
      window.location.reload();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { login, logout };
};
