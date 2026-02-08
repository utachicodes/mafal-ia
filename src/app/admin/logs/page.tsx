import { getPrisma } from "@/src/lib/db"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Info, AlertTriangle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function LogsPage() {
    const prisma = await getPrisma()

    // Fetch logs with basic pagination (last 100)
    const logs = await prisma.systemLog.findMany({
        orderBy: { timestamp: "desc" },
        take: 100
    })

    const getLevelBadge = (level: string) => {
        switch (level) {
            case "ERROR":
                return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" /> ERROR</Badge>
            case "WARN":
                // Using outline variant with custom colors for warning since 'warning' variant doesn't exist
                return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 gap-1"><AlertTriangle className="h-3 w-3" /> WARN</Badge>
            case "INFO":
                return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1"><Info className="h-3 w-3" /> INFO</Badge>
            default:
                return <Badge variant="outline">{level}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
                <Badge variant="outline" className="px-3 py-1">Last 100 entries</Badge>
            </div>

            <Card className="border-none shadow-md bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Application Events</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[180px]">Timestamp</TableHead>
                                    <TableHead className="w-[100px]">Level</TableHead>
                                    <TableHead className="w-[120px]">Source</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead className="w-[100px] text-right">Metadata</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No logs found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log: any) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                {format(new Date(log.timestamp), "MMM dd, HH:mm:ss")}
                                            </TableCell>
                                            <TableCell>{getLevelBadge(log.level)}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-mono text-xs">{log.source}</Badge>
                                            </TableCell>
                                            <TableCell className="max-w-[500px] truncate" title={log.message}>
                                                {log.message}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {log.metadata && (
                                                    <span className="text-xs text-muted-foreground font-mono truncate max-w-[150px] inline-block" title={JSON.stringify(log.metadata, null, 2)}>
                                                        {JSON.stringify(log.metadata)}
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
