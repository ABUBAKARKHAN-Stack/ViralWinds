"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FormEditor } from "@/components/admin/form/FormEditor";
import { successToast, errorToast } from "@/lib/toastNotifications";
import { createForm } from "@/app/actions/formActions";
import { FormField } from "@/types/form.types";

export default function AddFormPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        fields: [] as FormField[],
        submitButtonText: "Submit",
        successMessage: "Thank you! We'll get back to you soon.",
        redirectUrl: ""
    });

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

        setIsLoading(true);

        try {
            const result = await createForm(formData);

            if (result.success) {
                successToast("Form created successfully!");
                router.push("/admin/forms");
            } else {
                errorToast(result.error || "Failed to create form");
            }
        } catch (error) {
            console.error("Error creating form:", error);
            errorToast("Failed to create form");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6">
                <Link href="/admin/forms">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Forms
                    </Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Form</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Form Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Contact Form, Newsletter Signup"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
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
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Form"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
