import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    listUsers,
    createUser,
    deleteUser,
    changeUserRole,
    getUser,
    adminUpdateUser,
    adminUpdateUserPassword,
    adminBanUser,
    adminUnbanUser,
} from "@/helpers/adminUser";
import { AddUserFormValues, ChangePasswordFormValues, ChangeRoleFormValues, EditUserFormValues } from "@/schemas/auth.schema";
import { Permissions, Roles } from "@/types/auth.types";
import { errorToast, successToast } from "@/lib/toastNotifications";
import { Dispatch, SetStateAction } from "react";
import { queryClient } from "@/lib/query-client";
import { AdminUserKeys } from "@/constants/admin.constants";

export const useAdminUsers = () => {
    return useQuery({
        queryKey: AdminUserKeys.all,
        queryFn: listUsers,
        staleTime: 10 * 60 * 1000,
        gcTime: 10 * 60 * 1000
    });
};

export const useAdminUser = (userId: string) => {
    return useQuery({
        queryKey: AdminUserKeys.single(userId),
        queryFn: () => getUser(userId),
        enabled: !!userId,
        staleTime: 10 * 60 * 1000,
        gcTime: 10 * 60 * 1000
    });
};


export const useCreateUser = (setOpen: Dispatch<SetStateAction<boolean>>) => {

    return useMutation({
        mutationFn: (values: AddUserFormValues) => createUser(values),
        onSuccess: () => {
            successToast("User created successfully!");
            setOpen(false)
            queryClient.invalidateQueries({
                queryKey: AdminUserKeys.all,
            });
        },
        onError: (error: any) => {
            errorToast(error?.message || "Failed to create new user.");
        },
    });
};

export const useDeleteUser = () => {

    return useMutation({
        mutationFn: (userId: string) => deleteUser(userId),
        onSuccess: () => {
            successToast("User deleted successfully!");
            queryClient.invalidateQueries({
                queryKey: AdminUserKeys.all,
            });
        },
        onError: (error: any) => {
            errorToast(error?.message || "Failed to delete user.");
        },
    });
};

export const useChangeUserRole = () => {

    return useMutation({
        mutationFn: ({
            userId,
            values
        }: {
            userId: string;
            values: ChangeRoleFormValues
        }) => changeUserRole({ userId, values }),
        onSuccess: () => {
            successToast("User role has been changed successfully!");
            queryClient.invalidateQueries({
                queryKey: AdminUserKeys.all,
            });

        },
        onError: (error: any) => {
            errorToast(error?.message || "Failed to change user role.");
        },
    });
};


export const useUpdateUser = () => {

    return useMutation({
        mutationFn: ({
            userId,
            values
        }: {
            userId: string;
            values: ChangeRoleFormValues
        }) => adminUpdateUser({ userId, values }),
        onSuccess: () => {
            successToast("User updated successfully!");
            queryClient.invalidateQueries({
                queryKey: AdminUserKeys.all,
            });

        },
        onError: (error: any) => {
            errorToast(error?.message || "Failed to update user.");
        },
    });
};



export const useUpdateUserPassword = () => {

    return useMutation({
        mutationFn: ({
            userId,
            values
        }: {
            userId: string;
            values: ChangePasswordFormValues
        }) => adminUpdateUserPassword({ userId, values }),
        onSuccess: () => {
            successToast("Password updated successfully!");
            queryClient.invalidateQueries({
                queryKey: AdminUserKeys.all,
            });

        },
        onError: (error: any) => {
            errorToast(error?.message || "Failed to change user password.");
        },
    });
};


export const useBanUser = () => {

    return useMutation({
        mutationFn: (userId: string) => adminBanUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: AdminUserKeys.all,
            });

        },
        onError: (error: any) => {
            errorToast(error?.message || "Something went wrong while updating user status."
            );
        },
    });
};


export const useUnbanUser = () => {

    return useMutation({
        mutationFn: (userId: string) => adminUnbanUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: AdminUserKeys.all,
            });

        },
        onError: (error: any) => {
            errorToast(error?.message || "Something went wrong while updating user status."
            );
        },
    });
};
