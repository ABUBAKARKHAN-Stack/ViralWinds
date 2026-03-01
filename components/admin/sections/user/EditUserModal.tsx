"use client"
import { useState, useEffect, ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, EyeOff, Lock, User, Key } from "lucide-react";
import { UserWithRole } from "better-auth/plugins";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditUserFormValues, editUserSchema, changePasswordSchema, ChangePasswordFormValues } from "@/schemas/auth.schema";
import { Roles } from "@/types/auth.types";
import { useUpdateUser, useUpdateUserPassword, } from "@/hooks/useAdminUser";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { roleDescriptions, roleLabels } from "@/constants/admin.constants";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { errorToast } from "@/lib/toastNotifications";

interface EditUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: UserWithRole;
    children?: ReactNode;
    userBanned:boolean
}

export function EditUserModal({ open, onOpenChange, user, children,userBanned= false }: EditUserModalProps) {
    const [formData, setFormData] = useState<UserWithRole>(user);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [activeTab, setActiveTab] = useState("basic");

    const updateUser = useUpdateUser();
    const changePassword = useUpdateUserPassword();

    const basicInfoForm = useForm<EditUserFormValues>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            role: Roles.ADMIN,
            email: "",
            fullName: "",
        }
    });

    const passwordForm = useForm({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: ""
        }
    });

    useEffect(() => {
        if (user) {
            setFormData(user);
            basicInfoForm.reset({
                email: user.email || "",
                fullName: user.name || "",
                role: user.role as Roles || Roles.USER,
            });

            passwordForm.reset({
                newPassword: "",
                confirmPassword: ""
            });
        }
    }, [user, open]);

    const handleBasicInfoSubmit = (data: EditUserFormValues) => {

        if (userBanned) {
            errorToast("Cannot update a banned user. Please unban first.");
            return;
        }

        updateUser.mutate({
            userId: user.id,
            values: data
        }, {
            onSuccess() {
                onOpenChange(false);

            }
        });

    };

    const handlePasswordChangeSubmit = (data: ChangePasswordFormValues) => {

        if (userBanned) {
            errorToast("Cannot change password of a banned user. Please unban first.");
            return;
        }


        changePassword.mutate({
            userId: user.id,
            values: data
        }, {
            onSuccess() {
                passwordForm.reset({
                    newPassword: "",
                    confirmPassword: ""
                });
                setActiveTab("basic");
            },
        });



    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>

            {children && <DialogTrigger asChild>
                {children}
            </DialogTrigger>}

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update user information and permissions.
                    </DialogDescription>
                </DialogHeader>

                {/* Avatar and User Info */}
                <div className="flex items-center gap-4 pb-4 border-b">
                    <div className="relative">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={formData.image || ""} />
                            <AvatarFallback className="text-xl bg-secondary text-secondary-foreground">
                                {formData.name?.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                        </Avatar>

                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-lg">{formData.name}</p>
                        <p className="text-sm text-muted-foreground">{formData.email}</p>
                        <div className="mt-1">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                {roleLabels[user.role as Roles] || user.role}
                            </span>
                        </div>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="basic" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Basic Information
                        </TabsTrigger>
                        <TabsTrigger value="password" className="flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            Change Password
                        </TabsTrigger>
                    </TabsList>

                    {/* Basic Information Tab */}
                    <TabsContent value="basic" className="space-y-4 pt-4">
                        <Form {...basicInfoForm}>
                            <form
                                onSubmit={basicInfoForm.handleSubmit(handleBasicInfoSubmit)}
                                className="space-y-4"
                            >
                                {/* Full Name */}
                                <FormField
                                    control={basicInfoForm.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Email */}
                                <FormField
                                    control={basicInfoForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="Enter email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Role */}
                                <FormField
                                    control={basicInfoForm.control}
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



                                <DialogFooter className="pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => onOpenChange(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={updateUser.isPending}
                                    >
                                        {updateUser.isPending ? <>Saving <Spinner /></> : "Save Changes"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </TabsContent>

                    {/* Change Password Tab */}
                    <TabsContent value="password" className="space-y-4 pt-4">
                        <Form {...passwordForm}>
                            <form
                                onSubmit={passwordForm.handleSubmit(handlePasswordChangeSubmit)}
                                className="space-y-4"
                            >
                                <div className="space-y-4">

                                    <FormField
                                        control={passwordForm.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <InputGroup>
                                                        <InputGroupAddon align="inline-start">
                                                            <Lock className="h-4 w-4" />
                                                        </InputGroupAddon>
                                                        <InputGroupInput
                                                            type={showNewPassword ? "text" : "password"}
                                                            placeholder="Enter new password"
                                                            {...field}
                                                        />
                                                        <InputGroupAddon align="inline-end">
                                                            <InputGroupButton
                                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                                className='rounded-full'
                                                                size={"icon-xs"}
                                                                type="button"
                                                            >
                                                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                            </InputGroupButton>
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={passwordForm.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm New Password</FormLabel>
                                                <FormControl>
                                                    <InputGroup>
                                                        <InputGroupAddon align="inline-start">
                                                            <Lock className="h-4 w-4" />
                                                        </InputGroupAddon>
                                                        <InputGroupInput
                                                            type="password"
                                                            placeholder="Confirm new password"
                                                            {...field}
                                                        />
                                                    </InputGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="rounded-lg bg-muted/50 p-4">
                                    <h4 className="text-sm font-medium mb-2">Password Requirements</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                            At least 8 characters long
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                            Contains at least one uppercase letter
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                            Contains at least one number
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                            Contains at least one special character
                                        </li>
                                    </ul>
                                </div>

                                <DialogFooter className="pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            passwordForm.reset();
                                            setActiveTab("basic");
                                        }}
                                    >
                                        Back to Basic Info
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={changePassword.isPending}
                                    >
                                        {changePassword.isPending ? <>Changing <Spinner /> </> : "Change Password"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
