"use client"

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { FormEditor } from "@/components/admin/form/FormEditor";
import { successToast, errorToast } from "@/lib/toastNotifications";
import { getForm, updateForm, deleteForm } from "@/app/actions/formActions";
import { FormField } from "@/types/form.types";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EditFormPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        fields: [] as FormField[],
        submitButtonText: "Submit",
        successMessage: "Thank you! We'll get back to you soon.",
        redirectUrl: ""
    });

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const result = await getForm(id);
                if (result.success && result.data) {
                    setFormData({
                        name: result.data.name || "",
                        description: result.data.description || "",
                        fields: result.data.fields || [],
                        submitButtonText: result.data.submitButtonText || "Submit",
                        successMessage: result.data.successMessage || "Thank you! We'll get back to you soon.",
                        redirectUrl: result.data.redirectUrl || ""
                    });
                } else {
                    errorToast(result.error || "Failed to fetch form");
                    router.push("/admin/forms");
                }
            } catch (error) {
                console.error("Error fetching form:", error);
                errorToast("Failed to fetch form");
                router.push("/admin/forms");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchForm();
        }
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name) {
            errorToast("Please enter a form name");
            return;
        }

        if (formData.fields.length === 0) {
            errorToast("Please add at least one field");
            return;
        }

        setIsSaving(true);

        try {
            const result = await updateForm(id, formData);

            if (result.success) {
                successToast("Form updated successfully!");
                router.push("/admin/forms");
            } else {
                errorToast(result.error || "Failed to update form");
            }
        } catch (error) {
            console.error("Error updating form:", error);
            errorToast("Failed to update form");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteForm(id);
            if (result.success) {
                successToast("Form deleted successfully!");
                router.push("/admin/forms");
            } else {
                errorToast(result.error || "Failed to delete form");
            }
        } catch (error) {
            console.error("Error deleting form:", error);
            errorToast("Failed to delete form");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <Link href="/admin/forms">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Forms
                    </Button>
                </Link>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={isDeleting}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            {isDeleting ? "Deleting..." : "Delete Form"}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the form
                                and all its configuration.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Form: {formData.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name">Form Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Contact Form, Newsletter Signup"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Internal description of what this form is for"
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <FormEditor
                        fields={formData.fields}
                        onChange={(fields) => setFormData({ ...formData, fields })}
                        submitButtonText={formData.submitButtonText}
                        onSubmitButtonTextChange={(submitButtonText) => setFormData({ ...formData, submitButtonText })}
                        successMessage={formData.successMessage}
                        onSuccessMessageChange={(successMessage) => setFormData({ ...formData, successMessage })}
                        redirectUrl={formData.redirectUrl}
                        onRedirectUrlChange={(redirectUrl) => setFormData({ ...formData, redirectUrl })}
                    />

                    <div className="flex justify-end gap-4">
                        <Link href="/admin/forms">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
