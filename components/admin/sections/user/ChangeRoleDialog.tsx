"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ReactNode, useState } from "react";
import { Roles } from "@/types/auth.types";
import { roleLabels, roleDescriptions, rolePermissions } from '@/constants/admin.constants';
import { useForm } from "react-hook-form";
import { useAdminUser, useChangeUserRole } from "@/hooks/useAdminUser";
import { Spinner } from "@/components/ui/spinner";
import { ChangeRoleFormValues } from "@/schemas/auth.schema";
import { errorToast } from "@/lib/toastNotifications";

interface ChangeUserRoleProps {
    userId: string;
    currentRole: Roles;
    children: ReactNode;
    userBanned: boolean,

}

export default function ChangeUserRoleModal({ userId, currentRole, children, userBanned = false }: ChangeUserRoleProps) {
    const [open, setOpen] = useState(false);

    const changeRoleMutation = useChangeUserRole();

    const form = useForm<ChangeRoleFormValues>({
        defaultValues: {
            role: currentRole,
        },
    });
    const onSubmit = (values: { role: Roles }) => {

        if (userBanned) {
            errorToast("Cannot change role of a banned user. Please unban first.");
            return;
        }

        changeRoleMutation.mutate({ userId, values: { role: values.role }, }, {
            onSuccess() {
                setOpen(false);
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>


            <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Change User Role</DialogTitle>
                    <DialogDescription>
                        Update the role for this user.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        {/* Role Selector */}
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full py-6">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(Object.keys(roleLabels) as Roles[]).map((role) => (
                                                    <SelectItem key={role} value={role}>
                                                        <div className="flex flex-col">
                                                            <span className="text-start">{roleLabels[role]}</span>
                                                            <span className="text-xs text-start text-muted-foreground group-focus:text-accent-foreground group-focus:font-medium">
                                                                {roleDescriptions[role]}
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={changeRoleMutation.isPending}>
                                Update Role {changeRoleMutation.isPending && <Spinner />}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
