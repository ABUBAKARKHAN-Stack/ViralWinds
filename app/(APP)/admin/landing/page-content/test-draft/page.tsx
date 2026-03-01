import { testDraftSaveLoad } from "@/app/actions/testDraft"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = 'force-dynamic'

export default async function TestDraftPage() {
    const result = await testDraftSaveLoad()

    return (
        <div className="container mx-auto p-8">
            <Card>
                <CardHeader>
                    <CardTitle>Draft Save/Load Test</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <strong>Test Result:</strong> {result.success ? '✅ SUCCESS' : '❌ FAILED'}
                        </div>
                        {result.draft && (
                            <div>
                                <strong>Draft Data Found:</strong>
                                <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
                                    {JSON.stringify(result.draft, null, 2)}
                                </pre>
                            </div>
                        )}
                        {result.error && (
                            <div className="text-red-600">
                                <strong>Error:</strong> {result.error}
                            </div>
                        )}
                        <div className="pt-4">
                            <p className="text-sm text-muted-foreground">
                                Check the terminal running <code>npm run dev</code> for detailed logs.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
