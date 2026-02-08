import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OrderService } from "@/src/lib/order-service"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Filter,
  ShoppingBag,
  Download,
  Search,
  MoreHorizontal
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const dynamic = "force-dynamic"

interface Order {
  id: string
  phoneNumber: string
  restaurant: { name: string } | null
  total: number
  status: string
  createdAt: Date
}

export default async function OrdersPage() {
  const orders = await OrderService.getAllOrders() as unknown as Order[]

  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Orders
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage and track your restaurant orders
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="h-9 bg-red-600 hover:bg-red-700 text-white gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden">
        <CardHeader className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-row items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="pl-9 h-9 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors focus:border-red-500 focus:ring-red-500"
            />
          </div>
          <div className="text-xs text-gray-500 font-medium px-3 py-1 bg-white dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm">
            Showing {orders.length} orders
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="text-center py-24 bg-gray-50/30 dark:bg-gray-900/30">
              <div className="h-16 w-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No orders yet</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
                When customers place orders via WhatsApp, they will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/80 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 font-medium">Order ID</th>
                    <th className="px-6 py-3 font-medium">Customer</th>
                    <th className="px-6 py-3 font-medium">Location</th>
                    <th className="px-6 py-3 font-medium text-right">Amount</th>
                    <th className="px-6 py-3 font-medium text-center">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Date</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-medium text-gray-900 dark:text-white">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">{order.id.slice(0, 8)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white flex flex-col">
                          <span>{order.phoneNumber}</span>
                          <span className="text-xs text-gray-500 font-normal flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            WhatsApp
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {order.restaurant?.name || "-"}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white tabular-nums">
                        {new Intl.NumberFormat().format(order.total)} <span className="text-xs text-gray-500 font-normal ml-0.5">FCFA</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge
                          variant={order.status === 'completed' ? 'default' : order.status === 'processing' ? 'secondary' : 'outline'}
                          className={
                            order.status === 'completed' ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50 shadow-sm" :
                              order.status === 'processing' ? "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50 shadow-sm" :
                                "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                          }
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {format(order.createdAt, "MMM d, HH:mm")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Print Receipt</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20">Cancel Order</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
