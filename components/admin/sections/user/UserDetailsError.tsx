"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, UserX } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserDetailsErrorProps {
    onRetry?: () => void;
}

const UserDetailsError = ({ onRetry }: UserDetailsErrorProps) => {
    const router = useRouter();

    return (
        <div className="space-y-6">
            {/* Header */}
            <Button 
                variant="ghost" 
                onClick={() => router.push("/users")}
                className="w-fit"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Users
            </Button>

            {/* Error Card */}
            <Card className="border-destructive/20">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="relative">
                            <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center">
                                <AlertCircle className="h-10 w-10 text-destructive" />
                            </div>
                            <UserX className="h-8 w-8 text-destructive absolute -top-2 -right-2" />
                        </div>
                        
                        <div className="space-y-2 max-w-md">
                            <h2 className="text-xl font-semibold">User Not Found</h2>
                            <p className="text-sm text-muted-foreground">
                                The user you're looking for doesn't exist or you don't have permission to view it.
                                It might have been deleted or you may have followed a broken link.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button 
                                onClick={() => router.push("/users")}
                                variant="outline"
                                className="min-w-30"
                            >
                                Browse All Users
                            </Button>
                            
                            {onRetry && (
                                <Button 
                                    onClick={onRetry}
                                    className="min-w-30"
                                >
                                    Try Again
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserDetailsError;
