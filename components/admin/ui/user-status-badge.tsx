import { Badge } from "@/components/ui/badge";
import { Ban, CheckCircle } from "lucide-react";

interface UserStatusBadgeProps {
    isBanned: boolean;
}
export const UserStatusBadge = ({ isBanned }: UserStatusBadgeProps) => {
    if (isBanned) {
        return (
            <Badge variant="destructive" className="gap-1">
                <Ban className="h-3 w-3" />
                Banned
            </Badge>
        );
    }
    
    return (
        <Badge variant="success" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Active
        </Badge>
    );
};
