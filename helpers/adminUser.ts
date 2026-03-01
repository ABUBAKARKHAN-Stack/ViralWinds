import { AddUserFormValues, ChangePasswordFormValues, ChangeRoleFormValues, EditUserFormValues } from "@/schemas/auth.schema";
import { Roles } from "@/types/auth.types";
import { authClient } from "@/lib/auth-client";
import { rolePermissions } from "@/constants/admin.constants";
import { UserWithRole } from "better-auth/plugins";

export const listUsers = async () => {
    const { data, error } = await authClient.admin.listUsers({
        query: {
            searchOperator: "contains",
            sortBy: "name",
            sortDirection: "desc",
        },
    });
    if (error) return []
    return data?.users ?? [];
};

export const getUser = async (userId: string) => {
    const { data, error } = await authClient.admin.getUser({
        query: { id: userId }
    });
    if (error) return null

    return data as UserWithRole

}

export const createUser = async (values: AddUserFormValues) => {
    const permissions = rolePermissions[values.role];

    const { error } = await authClient.admin.createUser({
        email: values.email,
        name: values.fullName,
        password: values.password,
        role: values.role as any,
        data: {
            permissions,
            emailVerified: true,
        },
    });

    if (error) {
        throw error
    }
};

export const deleteUser = async (userId: string) => {
    const { error } = await authClient.admin.removeUser({ userId })
    if (error) {
        throw error
    }

};

export const changeUserRole = async ({
    userId,
    values
}: {
    userId: string;
    values: ChangeRoleFormValues

}) => {
    const permissions = rolePermissions[values.role]
    const { error } = await authClient.admin.updateUser({
        userId,
        data: {
            role: values.role,
            permissions
        }
    });
    if (error) {
        throw error
    }
};


export const adminUpdateUser = async ({
    userId,
    values
}: {
    userId: string;
    values: EditUserFormValues

}) => {
    const permissions = rolePermissions[values.role]
    const { error } = await authClient.admin.updateUser({
        userId,
        data: {
            name: values.fullName,
            ...values,
            permissions
        }
    });
    if (error) {
        throw error
    }
};


export const adminUpdateUserPassword = async ({
    userId,
    values
}: {
    userId: string;
    values: ChangePasswordFormValues

}) => {
    const { error } = await authClient.admin.setUserPassword({
        userId,
        newPassword: values.newPassword
    });
    if (error) {
        throw error
    }
};


export const adminBanUser = async (userId:string) => {
    const { error } = await authClient.admin.banUser({
        userId,
    });
    if (error) {
        throw error
    }
}

export const adminUnbanUser = async (userId:string) => {
    const { error } = await authClient.admin.unbanUser({
        userId,
    });
    if (error) {
        throw error
    }
}