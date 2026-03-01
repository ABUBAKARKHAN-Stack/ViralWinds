import { Check, X } from "lucide-react";

interface PermissionItemProps {
    enabled: boolean;
    size?: "sm" | "md" | "lg";
}

export const PermissionItem = ({ enabled, size = "md" }: PermissionItemProps) => {
    const sizeClasses = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5"
    };

    return (
        <div className={`inline-flex items-center justify-center rounded-full ${enabled ? 'bg-green-500/20 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
            {enabled ? (
                <Check className={sizeClasses[size]} />
            ) : (
                <X className={sizeClasses[size]} />
            )}
        </div>
    );
};
