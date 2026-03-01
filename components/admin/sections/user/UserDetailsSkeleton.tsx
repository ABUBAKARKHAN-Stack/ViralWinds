import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const UserDetailsSkeleton = () => {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Button variant="ghost" disabled>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Users
                </Button>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-9 w-24" />
                </div>
            </div>

            {/* Profile Header Card Skeleton */}
            <Card className="overflow-hidden">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <Skeleton className="h-24 w-24 rounded-full" />

                        <div className="flex-1 space-y-4">
                            <div>
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <Skeleton className="h-8 w-48" />
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </div>
                                <Skeleton className="h-4 w-64" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="p-3 bg-muted/30 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-10 w-10 rounded-md" />
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-3 w-16" />
                                                <Skeleton className="h-4 w-32" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Permissions Section Skeleton */}
            <Card>
                <CardHeader className="border-b border-border/50">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-56" />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    <div className="grid gap-6 sm:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, groupIndex) => (
                            <div key={groupIndex} className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-16" />
                                </div>

                                <div className="space-y-3">
                                    {Array.from({ length: 3 }).map((_, permIndex) => (
                                        <div key={permIndex} className="flex items-center justify-start gap-4">
                                            <Skeleton className="h-4 w-4 rounded-full" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserDetailsSkeleton;
