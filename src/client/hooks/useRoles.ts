import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../api.ts";
import type { RoleItem, RouterInputs } from "../types/api.ts";
import { toast } from "../utils/toast.ts";
import { useI18n } from "./useI18n.ts";

export type RoleFormValues = Pick<
  RouterInputs["role"]["create"],
  "code" | "name" | "sort" | "dataScope"
> & {
  description?: string | null;
  permissionIds: number[];
  departmentIds?: number[];
};

/**
 * Headless Feature Hook encapsulating all Role state, queries, and RPC mutations.
 */
export function useRoles() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);
  const [formRevision, setFormRevision] = useState(0);

  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ["roles", "list"],
    queryFn: async () => {
      const res = await api.roles.$get();
      if (!res.ok) {
        throw new Error("Failed to fetch roles");
      }
      return await res.json();
    },
  });

  const { data: permsData } = useQuery({
    queryKey: ["permissions", "list"],
    queryFn: async () => {
      const res = await api.permissions.$get();
      if (!res.ok) {
        throw new Error("Failed to fetch permissions");
      }
      return await res.json();
    },
  });

  const { data: deptsData } = useQuery({
    queryKey: ["departments", "list"],
    queryFn: async () => {
      const res = await api.departments.$get();
      if (!res.ok) {
        throw new Error("Failed to fetch departments");
      }
      return await res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.roles[":id"].$delete({
        param: { id: id.toString() },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      return await res.json();
    },
    onSuccess: () => {
      toast.success(t("common.success"));
      void queryClient.invalidateQueries({ queryKey: ["roles", "list"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values: RoleFormValues) => {
      if (selectedRole !== null) {
        const res = await api.roles[":id"].$put({
          param: { id: selectedRole.id.toString() },
          json: {
            name: values.name,
            description: values.description ?? null,
            dataScope: values.dataScope,
            sort: values.sort,
            permissionIds: values.permissionIds,
            departmentIds: values.dataScope === "CUSTOM" ? (values.departmentIds ?? []) : [],
          },
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error);
        }
        return await res.json();
      }

      const res = await api.roles.$post({
        json: {
          code: values.code,
          name: values.name,
          description: values.description ?? undefined,
          dataScope: values.dataScope,
          sort: values.sort,
          permissionIds: values.permissionIds,
          departmentIds: values.dataScope === "CUSTOM" ? (values.departmentIds ?? []) : [],
        },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      return await res.json();
    },
    onSuccess: () => {
      toast.success(t("common.success"));
      closeDrawer();
      void queryClient.invalidateQueries({ queryKey: ["roles", "list"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const formKey = `${selectedRole !== null ? selectedRole.id.toString() : "new"}-${formRevision.toString()}`;

  const openCreateDrawer = () => {
    setSelectedRole(null);
    setFormRevision((r) => r + 1);
    setDrawerOpen(true);
  };

  const openEditDrawer = (role: RoleItem) => {
    setSelectedRole(role);
    setFormRevision((r) => r + 1);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return {
    roles: rolesData?.items ?? [],
    permissions: permsData?.items ?? [],
    departments: deptsData?.items ?? [],
    isLoading: rolesLoading,
    drawerOpen,
    selectedRole,
    formKey,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
    openCreateDrawer,
    openEditDrawer,
    closeDrawer,
    saveRole: (values: RoleFormValues) => {
      saveMutation.mutate(values);
    },
    deleteRole: (id: number) => {
      deleteMutation.mutate(id);
    },
  };
}
