import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type UnauthorizedProps = {
    title?: string;
    message?: string;
    requiredRole?: string;
};

export default function Unauthorized({
    title = "Access Denied",
    message = "You don't have permission to access this page.",
    requiredRole,
}: UnauthorizedProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <Shield className="h-16 w-16 text-muted-foreground mb-4" />

            <h1 className="text-2xl font-bold">{title}</h1>

            <p className="text-muted-foreground mt-2 max-w-md">
                {message}
            </p>

            {requiredRole && (
                <Badge variant="secondary" className="mt-4">
                    {requiredRole} role required
                </Badge>
            )}
        </div>
    );
}
