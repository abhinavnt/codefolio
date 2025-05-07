"use client"

import { useState, useEffect } from "react"
import { Download, FileText, ChevronLeft, ChevronRight, Filter, Calendar, CreditCard, Search } from "lucide-react"
import axiosInstance from "@/utils/axiosInstance"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export function PurchaseHistory() {
  const [purchases, setPurchases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [timeFilter, setTimeFilter] = useState("all")

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get("/api/payment/purchase-history")
        setPurchases(response.data)
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch purchase history")
      } finally {
        setLoading(false)
      }
    }

    fetchPurchases()
  }, [])

  // Filter purchases based on search query
  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get current purchases for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentPurchases = filteredPurchases.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage)

  // Change page
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800"
      case "Pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800"
      case "Failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    }
  }

  // Responsive rendering for different screen sizes
  const renderMobileView = () => {
    return (
      <div className="space-y-4">
        {currentPurchases.map((purchase: any) => (
          <Card
            key={purchase.id}
            className="overflow-hidden border border-border/60 hover:border-border transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between p-4 border-b border-border/60 bg-gradient-to-r from-muted/50 to-muted/20">
              <div className="flex items-center gap-3">
                <div className="h-12 w-16 rounded-md overflow-hidden shadow-sm">
                  {purchase.image ? (
                    <img
                      src={purchase.image || "/placeholder.svg"}
                      alt={purchase.course}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium line-clamp-1">{purchase.course}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {purchase.date}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className={`${getStatusColor(purchase.status)}`}>
                {purchase.status}
              </Badge>
            </div>
            <div className="p-4 bg-card">
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm text-muted-foreground">Invoice</div>
                <div className="font-medium">{purchase.id}</div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-muted-foreground">Amount</div>
                <div className="font-semibold text-lg">₹{purchase.price}</div>
              </div>
             
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const renderDesktopView = () => {
    return (
      <div className="rounded-xl border border-border/60 overflow-hidden shadow-md bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900">
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Invoice
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
               Payment Status
              </th>

            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 bg-card">
            {currentPurchases.map((purchase: any) => (
              <tr
                key={purchase.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
              >
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">{purchase.id}</td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-12 w-20 flex-shrink-0 rounded-md overflow-hidden shadow-sm border border-border/60">
                      {purchase.image ? (
                        <img
                          src={purchase.image || "/placeholder.svg"}
                          alt={purchase.course}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium line-clamp-1">{purchase.course}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-muted-foreground">{purchase.date}</td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold">₹{purchase.price}</td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <Badge variant="outline" className={`${getStatusColor(purchase.status)}`}>
                    {purchase.status}
                  </Badge>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-[1200px] mx-auto shadow-lg border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 overflow-hidden">
      <CardHeader className="pb-0 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              Purchase History
            </CardTitle>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">View purchase records</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            {/* <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search purchases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 w-full sm:w-[200px]"
              />
            </div> */}
            {/* <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-slate-400" />
              <Select defaultValue={timeFilter} onValueChange={(value) => setTimeFilter(value)}>
                <SelectTrigger className="w-full sm:w-[160px] h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                  <SelectValue placeholder="Filter by time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              >
                <Skeleton className="h-12 w-12 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[250px] bg-slate-200 dark:bg-slate-800" />
                  <Skeleton className="h-4 w-[200px] bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg p-8 text-center border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50"
            >
              Try Again
            </Button>
          </div>
        ) : filteredPurchases.length > 0 ? (
          <>
            {/* Responsive layout - show cards on mobile, table on larger screens */}
            <div className="block md:hidden">{renderMobileView()}</div>
            <div className="hidden md:block">{renderDesktopView()}</div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Showing {indexOfFirstItem + 1}-
                {indexOfLastItem > filteredPurchases.length ? filteredPurchases.length : indexOfLastItem} of{" "}
                {filteredPurchases.length} items
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="w-[80px] h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-l-lg rounded-r-none border-r-0 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="px-4 py-1.5 border border-slate-200 dark:border-slate-700 text-sm font-medium bg-white dark:bg-slate-900">
                    {currentPage} / {totalPages || 1}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-r-lg rounded-l-none border-l-0 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-xl p-10 text-center border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <FileText className="h-8 w-8 text-slate-500 dark:text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">No purchases yet</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                You haven't made any purchases yet. Browse our courses to find something that interests you.
              </p>
              <Button className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 dark:from-slate-600 dark:to-slate-800 px-6 shadow-md">
                Browse Courses
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
