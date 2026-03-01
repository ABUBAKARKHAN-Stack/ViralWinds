import { Button } from "@/components/ui/button"
import { getLocations } from "@/app/actions/location"
import Link from "next/link"
import { Plus, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LocationActions } from "@/components/admin/locations/LocationActions"

export default async function LocationsPage() {
    const locations = await getLocations()

    return (
        <div className="container mx-auto pb-10 max-w-5xl">
            <div className="flex items-center justify-between py-6">
                <div>
                    <h1 className="text-3xl font-bold">Locations</h1>
                    <p className="text-muted-foreground">Manage your locations.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/blogs/locations/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Location
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {locations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                                        No locations found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                locations.map((location: any) => (
                                    <TableRow key={location._id}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            {location.title}
                                        </TableCell>
                                        <TableCell>
                                            <LocationActions id={location._id} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
