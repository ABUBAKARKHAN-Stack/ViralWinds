"use client"

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    MoreHorizontal,
    Mail,
    Trash2,
    CheckCircle2,
    Clock,
    Archive,
    Eye,
    Search,
    Filter
} from "lucide-react";
import { updateSubmissionStatus, deleteSubmission } from "@/app/actions/submissionActions";
import { successToast, errorToast } from "@/lib/toastNotifications";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type ContactSubmission = {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    submittedAt: string;
};

interface SubmissionsTableProps {
    initialSubmissions: ContactSubmission[];
}

export function SubmissionsTable({ initialSubmissions }: SubmissionsTableProps) {
    const [submissions, setSubmissions] = useState(initialSubmissions);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

    const filteredSubmissions = submissions.filter(s => {
        const matchesSearch =
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.subject.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || s.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleStatusUpdate = async (id: string, newStatus: any) => {
        const result = await updateSubmissionStatus(id, newStatus);
        if (result.success) {
            setSubmissions(submissions.map(s => s._id === id ? { ...s, status: newStatus } : s));
            successToast(`Status updated to ${newStatus}`);
        } else {
            errorToast(result.error || "Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this submission?")) return;

        const result = await deleteSubmission(id);
        if (result.success) {
            setSubmissions(submissions.filter(s => s._id !== id));
            successToast("Submission deleted");
        } else {
            errorToast(result.error || "Failed to delete submission");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new': return <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>;
            case 'read': return <Badge className="bg-yellow-500 hover:bg-yellow-600">Read</Badge>;
            case 'replied': return <Badge className="bg-green-500 hover:bg-green-600">Replied</Badge>;
            case 'archived': return <Badge className="bg-gray-500 hover:bg-gray-600">Archived</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email or subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="read">Read</SelectItem>
                            <SelectItem value="replied">Replied</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Sender</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSubmissions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No submissions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredSubmissions.map((submission) => (
                                <TableRow key={submission._id}>
                                    <TableCell className="font-medium">
                                        {new Date(submission.submittedAt).toLocaleDateString()}
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(submission.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-semibold">{submission.name}</div>
                                        <div className="text-xs text-muted-foreground">{submission.email}</div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        {submission.subject}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(submission.status)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => setSelectedSubmission(submission)}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleStatusUpdate(submission._id, 'read')}>
                                                    <Eye className="mr-2 h-4 w-4" /> Mark as Read
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusUpdate(submission._id, 'replied')}>
                                                    <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Replied
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusUpdate(submission._id, 'archived')}>
                                                    <Archive className="mr-2 h-4 w-4" /> Archive
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDelete(submission._id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Details Modal */}
            <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center gap-2">
                            {selectedSubmission?.subject}
                            {selectedSubmission && getStatusBadge(selectedSubmission.status)}
                        </DialogTitle>
                        <DialogDescription className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" /> {selectedSubmission?.email}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" /> {selectedSubmission && new Date(selectedSubmission.submittedAt).toLocaleString()}
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-1 bg-muted/50 p-4 rounded-lg">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase">From</h4>
                            <p className="text-lg font-medium">{selectedSubmission?.name}</p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase border-b pb-1">Message</h4>
                            <div className="text-base leading-relaxed whitespace-pre-wrap min-h-[100px]">
                                {selectedSubmission?.message}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
