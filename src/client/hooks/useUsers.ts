import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../api.ts";
import type { RouterInputs, UserItem } from "../types/api.ts";
import { toast } from "../utils/toast.ts";
import { useI18n } from "./useI18n.ts";

export type UserFormValues = Pick<
  RouterInputs["user"]["create"],
  "account" | "status" | "roleIds"
> & {
  password?: string;
  name?: string | null;
  employeeNo?: string | null;
  title?: string | null;
  departmentId?: number | null;
};

/**
 * Headless Feature Hook encapsulating all User state, queries, and RPC mutations.
 */
export function useUsers() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [formRevision, setFormRevision] = useState(0);

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["users", "list"],
    queryFn: async () => {
      const res = await api.users.$get();
      if (!res.ok) {
        throw new Error("Failed to fetch users");
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

  const { data: rolesData } = useQuery({
    queryKey: ["roles", "list"],
    queryFn: async () => {
      const res = await api.roles.$get();
      if (!res.ok) {
        throw new Error("Failed to fetch roles");
      }
      return await res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.users[":id"].$delete({
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
      void queryClient.invalidateQueries({ queryKey: ["users", "list"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values: UserFormValues) => {
      const targetDeptId =
        values.departmentId !== undefined && values.departmentId !== null && values.departmentId > 0
          ? values.departmentId
          : null;

      if (selectedUser !== null) {
        const res = await api.users[":id"].$put({
          param: { id: selectedUser.id.toString() },
          json: {
            password:
              values.password !== undefined && values.password.length > 0
                ? values.password
                : undefined,
            name: values.name ?? null,
            employeeNo: values.employeeNo ?? null,
            title: values.title ?? null,
            status: values.status,
            departmentId: targetDeptId,
            roleIds: values.roleIds,
          },
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error);
        }
        return await res.json();
      }

      const res = await api.users.$post({
        json: {
          account: values.account,
          password: values.password ?? "password123",
          name: values.name ?? undefined,
          employeeNo: values.employeeNo ?? undefined,
          title: values.title ?? undefined,
          status: values.status,
          departmentId: targetDeptId,
          roleIds: values.roleIds,
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
      closeModal();
      void queryClient.invalidateQueries({ queryKey: ["users", "list"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const formKey = `${selectedUser !== null ? selectedUser.id.toString() : "new"}-${formRevision.toString()}`;

  const openCreateModal = () => {
    setSelectedUser(null);
    setFormRevision((r) => r + 1);
    setModalOpen(true);
  };

  const openEditModal = (user: UserItem) => {
    setSelectedUser(user);
    setFormRevision((r) => r + 1);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return {
    users: usersData?.items ?? [],
    departments: deptsData?.items ?? [],
    roles: rolesData?.items ?? [],
    isLoading: usersLoading,
    modalOpen,
    selectedUser,
    formKey,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
    openCreateModal,
    openEditModal,
    closeModal,
    saveUser: (values: UserFormValues) => {
      saveMutation.mutate(values);
    },
    deleteUser: (id: number) => {
      deleteMutation.mutate(id);
    },
  };
}
