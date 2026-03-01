"use server"

import { adminClient } from "@/sanity/lib/admin-client";
import { revalidatePath } from "next/cache";

export async function updateSubmissionStatus(id: string, status: 'new' | 'read' | 'replied' | 'archived') {
    try {
        await adminClient
            .patch(id)
            .set({ status })
            .commit();

        revalidatePath("/admin/contact-submissions");
        return { success: true };
    } catch (error: any) {
        console.error("Error updating submission status:", error);
        return { success: false, error: error.message || "Failed to update status" };
    }
}

export async function deleteSubmission(id: string) {
    try {
        await adminClient.delete(id);
        revalidatePath("/admin/contact-submissions");
        return { success: true };
    } catch (error: any) {
        console.error("Error deleting submission:", error);
        return { success: false, error: error.message || "Failed to delete submission" };
    }
}
