'use server'

import { adminClient } from "@/sanity/lib/admin-client"

export async function createForm(formData: any) {
    try {
        if (!formData.name) {
            return { success: false, error: "Form name is required" };
        }

        if (formData.fields.length === 0) {
            return { success: false, error: "At least one field is required" };
        }

        const result = await adminClient.create({
            _type: 'form',
            ...formData
        });

        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error creating form:", error);
        return { success: false, error: error.message || "Failed to create form" };
    }
}

export async function updateForm(id: string, formData: Partial<any>) {
    try {
        const result = await adminClient
            .patch(id)
            .set(formData)
            .commit();

        return { success: true, data: result };
    } catch (error: any) {
        console.error("Error updating form:", error);
        return { success: false, error: error.message || "Failed to update form" };
    }
}

export async function deleteForm(id: string) {
    try {
        await adminClient.delete(id);
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting form:", error);
        return { success: false, error: error.message || "Failed to delete form" };
    }
}

export async function getForms() {
    try {
        const forms = await adminClient.fetch(`*[_type == "form"] | order(_createdAt desc) {
            _id,
            _createdAt,
            name,
            description,
            fields,
            submitButtonText,
            successMessage,
            redirectUrl
        }`);
        return { success: true, data: forms };
    } catch (error: any) {
        console.error("Error fetching forms:", error);
        return { success: false, error: error.message || "Failed to fetch forms" };
    }
}

export async function getForm(id: string) {
    try {
        const form = await adminClient.fetch(`*[_type == "form" && _id == $id][0] {
            _id,
            _createdAt,
            name,
            description,
            fields,
            submitButtonText,
            successMessage,
            redirectUrl
        }`, { id });

        if (!form) {
            return { success: false, error: "Form not found" };
        }

        return { success: true, data: form };
    } catch (error: any) {
        console.error("Error fetching form:", error);
        return { success: false, error: error.message || "Failed to fetch form" };
    }
}

export async function submitDynamicForm(formId: string, formData: Record<string, any>) {
    try {
        // Fetch the form configuration to validate against
        const formResult = await getForm(formId);
        if (!formResult.success || !formResult.data) {
            return { success: false, error: "Form not found" };
        }

        const form = formResult.data;

        // Basic validation: check required fields
        for (const field of form.fields) {
            if (field.required && !formData[field.fieldName]) {
                const label = field.label || field.fieldName;
                return {
                    success: false,
                    error: `${label} is required`
                };
            }
        }

        // Store the submission
        await adminClient.create({
            _type: 'formSubmission',
            formId: formId,
            formName: form.name,
            submittedAt: new Date().toISOString(),
            data: formData
        });

        return {
            success: true,
            message: form.successMessage || "Thank you! We'll get back to you soon.",
            redirectUrl: form.redirectUrl
        };
    } catch (error: any) {
        console.error("Error submitting form:", error);
        return { success: false, error: error.message || "Failed to submit form" };
    }
}
