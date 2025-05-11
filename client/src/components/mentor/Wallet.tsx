"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  WalletIcon,
  Calendar,
  ArrowDownUp,
  FilterIcon,
  RefreshCw,
} from "lucide-react"
import axiosInstance from "@/utils/axiosInstance"
import { type RootState, useAppSelector } from "@/redux/store"
import { WithdrawModal } from "./WithdrawModal"
import { Skeleton } from "@/components/ui/skeleton"

interface Transaction {
  id: string
  transactionId: string
  date: string
  description: string
  amount: number
  type: "credit" | "debit"
}

export function Wallet() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [balance, setBalance] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [error, setError] = useState<string | null>(null)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false)
  const [thisMonthRevenue, setThisMonthRevenue] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const limit = 10

  const { mentor } = useAppSelector((state: RootState) => state.mentor)

  useEffect(() => {
    if (!mentor) {
      setError("Mentor ID is not available")
      setLoading(false)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        const transactionsResponse = await axiosInstance.get(`/api/wallet/${mentor._id}/transactions`, {
          params: { page, limit },
        })
        const { transactions, total } = transactionsResponse.data
        const formattedTransactions = transactions.map((t: any) => ({
          id: t._id,
          transactionId: t.transactionId,
          date: new Date(t.date).toLocaleDateString(),
          description: t.description,
          amount: t.amount,
          type: t.type,
        }))
        setTransactions(formattedTransactions)
        setTotal(total)

        // Calculate this month's revenue
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const monthlyRevenue = formattedTransactions
          .filter((t: Transaction) => {
            const transactionDate = new Date(t.date)
            return (
              transactionDate.getMonth() === currentMonth &&
              transactionDate.getFullYear() === currentYear &&
              t.type === "credit"
            )
          })
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
        setThisMonthRevenue(monthlyRevenue)

        // Fetch balance
        const balanceResponse = await axiosInstance.get(`/api/wallet/${mentor._id}/balance`)
        setBalance(balanceResponse.data.balance)
        setError(null)
      } catch (error: any) {
        setError(error.response?.data?.error || "Error fetching wallet data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [mentor?._id, page])

  const handleWithdraw = async (amount: number, paymentMethod: string, paymentDetails: any) => {
    if (!mentor?._id) {
      throw new Error("Mentor ID is not available")
    }

    try {
      await axiosInstance.post(`/api/wallet/${mentor._id}/withdraw`, {
        amount,
        description: `Withdrawal request of ₹${amount.toFixed(2)}`,
        paymentMethod,
        paymentDetails,
      })

      // Refresh balance and transactions
      const balanceResponse = await axiosInstance.get(`/api/wallet/${mentor._id}/balance`)
      setBalance(balanceResponse.data.balance)
      setPage(1)
      setError(null)
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Error processing withdrawal request")
    }
  }

  const refreshData = () => {
    if (mentor?._id) {
      setPage(1)
    }
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <ArrowDownUp className="h-5 w-5" /> Error
          </CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={refreshData}>
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <WalletIcon className="h-5 w-5" /> Wallet Balance
                </CardTitle>
                <CardDescription>Your current balance and payment options</CardDescription>
              </div>
              <Button size="sm" variant="ghost" onClick={refreshData}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-48" />
                <Skeleton className="h-10 w-32" />
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                  <div className="flex items-center">
                    <IndianRupee className="h-6 w-6 mr-1 text-foreground" />
                    <h2 className="text-4xl font-bold">{balance.toFixed(2)}</h2>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={() => setIsWithdrawModalOpen(true)}
                  >
                    <ArrowDownIcon className="mr-2 h-4 w-4" /> Withdraw Funds
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <div className="bg-muted/50 px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">This Month</p>
                <div className="flex items-center">
                  <ArrowUpIcon className="h-4 w-4 mr-1 text-emerald-500" />
                  <span className="text-lg font-medium">₹{thisMonthRevenue.toFixed(2)}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
                <div className="flex items-center">
                  <ArrowDownUp className="h-4 w-4 mr-1" />
                  <span className="text-lg font-medium">{total}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-lg font-medium">{new Date().toLocaleDateString('en-GB')}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <ArrowDownUp className="h-5 w-5" /> Transaction History
              </CardTitle>
              <CardDescription>Your recent transactions and payment history</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="w-fit">
              <FilterIcon className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="mb-4 grid w-full grid-cols-3 h-10">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="credits">Credits</TabsTrigger>
                <TabsTrigger value="debits">Debits</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left py-3 px-4 font-medium">Transaction ID</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-left py-3 px-4 font-medium">Description</th>
                        <th className="text-right py-3 px-4 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-muted-foreground">
                            No transactions found
                          </td>
                        </tr>
                      ) : (
                        transactions.map((transaction) => (
                          <tr key={transaction.id} className="border-t hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4 font-mono text-sm">{transaction.transactionId}</td>
                            <td className="py-3 px-4">{transaction.date}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                {transaction.description}
                                <Badge
                                  variant={transaction.type === "credit" ? "outline" : "secondary"}
                                  className={`ml-2 ${
                                    transaction.type === "credit"
                                      ? "border-emerald-200 text-emerald-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {transaction.type === "credit" ? "Credit" : "Debit"}
                                </Badge>
                              </div>
                            </td>
                            <td
                              className={`py-3 px-4 text-right font-medium ${
                                transaction.type === "credit" ? "text-emerald-600" : "text-red-600"
                              }`}
                            >
                              {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                    <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages || 1}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="credits" className="mt-0">
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left py-3 px-4 font-medium">Transaction ID</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-left py-3 px-4 font-medium">Description</th>
                        <th className="text-right py-3 px-4 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.filter((t) => t.type === "credit").length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-muted-foreground">
                            No credit transactions found
                          </td>
                        </tr>
                      ) : (
                        transactions
                          .filter((transaction) => transaction.type === "credit")
                          .map((transaction) => (
                            <tr key={transaction.id} className="border-t hover:bg-muted/30 transition-colors">
                              <td className="py-3 px-4 font-mono text-sm">{transaction.transactionId}</td>
                              <td className="py-3 px-4">{transaction.date}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  {transaction.description}
                                  <Badge variant="outline" className="ml-2 border-emerald-200 text-emerald-700">
                                    Credit
                                  </Badge>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right font-medium text-emerald-600">
                                +₹{transaction.amount.toFixed(2)}
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                    <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages || 1}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="debits" className="mt-0">
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left py-3 px-4 font-medium">Transaction ID</th>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-left py-3 px-4 font-medium">Description</th>
                        <th className="text-right py-3 px-4 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.filter((t) => t.type === "debit").length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-muted-foreground">
                            No debit transactions found
                          </td>
                        </tr>
                      ) : (
                        transactions
                          .filter((transaction) => transaction.type === "debit")
                          .map((transaction) => (
                            <tr key={transaction.id} className="border-t hover:bg-muted/30 transition-colors">
                              <td className="py-3 px-4 font-mono text-sm">{transaction.transactionId}</td>
                              <td className="py-3 px-4">{transaction.date}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  {transaction.description}
                                  <Badge variant="secondary" className="ml-2 bg-red-100 text-red-700">
                                    Debit
                                  </Badge>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right font-medium text-red-600">
                                -₹{transaction.amount.toFixed(2)}
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                    <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages || 1}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onWithdraw={handleWithdraw}
        balance={balance}
      />
    </div>
  )
}
