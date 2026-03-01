import { adminClient } from "@/sanity/lib/admin-client";
import { SubmissionsTable } from "@/components/admin/sections/contact-submissions/SubmissionsTable";

type ContactSubmission = {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    submittedAt: string;
};

async function getContactSubmissions(): Promise<ContactSubmission[]> {
    const submissions = await adminClient.fetch(`
        *[_type == "contactSubmission"] | order(submittedAt desc) {
            _id,
            name,
            email,
            subject,
            message,
            status,
            submittedAt
        }
    `);
    return submissions;
}

export default async function ContactSubmissionsPage() {
    const submissions = await getContactSubmissions();

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Contact Submissions</h1>
                    <p className="text-muted-foreground">
                        View and manage contact form submissions from your website.
                    </p>
                </div>
                <div className="bg-card px-4 py-2 rounded-lg border shadow-sm flex items-center gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">
                            {submissions.filter(s => s.status === 'new').length}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-muted-foreground">New</div>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center">
                        <div className="text-2xl font-bold">
                            {submissions.length}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-muted-foreground">Total</div>
                    </div>
                </div>
            </div>

            <SubmissionsTable initialSubmissions={submissions} />
        </div>
    );
}
