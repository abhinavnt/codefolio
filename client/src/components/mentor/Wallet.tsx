import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownIcon, ArrowUpIcon, ChevronLeft, ChevronRight, IndianRupee } from "lucide-react"
import axiosInstance from "@/utils/axiosInstance"
import { type RootState, useAppSelector } from "@/redux/store"
import { toast } from "sonner"
import { WithdrawModal } from "./WithdrawModal"

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
  const limit = 10

  const { mentor } = useAppSelector((state: RootState) => state.mentor)

  useEffect(() => {
    if (!mentor) {
      setError("Mentor ID is not available")
      return
    }

    const fetchData = async () => {
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
      }
    }
    fetchData()
  }, [mentor?._id, page])

  const handleWithdraw = async (amount: number, paymentMethod: string, paymentDetails: any) => {
    if (!mentor?._id) {
      throw new Error("Mentor ID is not available")
    }

    if (mentor?._id) {
      toast.error("withdrawal is not available at this moment")
      return
    }

    try {
      await axiosInstance.post(`/api/wallet/${mentor._id}/withdraw`, {
        amount,
        description: `Withdrawal of ₹${amount.toFixed(2)}`,
        paymentMethod,
        paymentDetails,
      })

      // Refresh balance and transactions
      const balanceResponse = await axiosInstance.get(`/api/wallet/${mentor._id}/balance`)
      setBalance(balanceResponse.data.balance)
      setPage(1)
      setError(null)
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Error processing withdrawal")
    }
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Wallet Balance</CardTitle>
            <CardDescription>Your current balance and payment options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-500 mb-1">Available Balance</p>
                <h2 className="text-4xl font-bold text-emerald-500">₹{balance.toFixed(2)}</h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => setIsWithdrawModalOpen(true)}>
                  Withdraw Funds
                </Button>
                <Button variant="outline">Payment Settings</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Stats</CardTitle>
            <CardDescription>Your payment statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Earned</p>
                  <p className="text-xl font-bold">₹{balance.toFixed(2)}</p>
                </div>
                <div className="rounded-full bg-emerald-100 p-2">
                  <IndianRupee className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">This Month</p>
                  <p className="text-xl font-bold">₹{thisMonthRevenue.toFixed(2)}</p>
                </div>
                <div className="rounded-full bg-blue-100 p-2">
                  <ArrowUpIcon className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-xl font-bold">₹0.00</p>
                </div>
                <div className="rounded-full bg-amber-100 p-2">
                  <ArrowDownIcon className="h-5 w-5 text-amber-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent transactions and payment history</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="credits">Credits</TabsTrigger>
              <TabsTrigger value="debits">Debits</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Transaction ID</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Description</th>
                      <th className="text-right py-3 px-4 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-4">{transaction.transactionId}</td>
                        <td className="py-3 px-4">{transaction.date}</td>
                        <td className="py-3 px-4">{transaction.description}</td>
                        <td
                          className={`py-3 px-4 text-right ${
                            transaction.type === "credit" ? "text-emerald-500" : "text-red-500"
                          }`}
                        >
                          {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                  <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
                <p>
                  Page {page} of {totalPages}
                </p>
                <Button variant="outline" disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="credits" className="mt-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Transaction ID</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Description</th>
                      <th className="text-right py-3 px-4 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions
                      .filter((transaction) => transaction.type === "credit")
                      .map((transaction) => (
                        <tr key={transaction.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-3 px-4">{transaction.transactionId}</td>
                          <td className="py-3 px-4">{transaction.date}</td>
                          <td className="py-3 px-4">{transaction.description}</td>
                          <td className="py-3 px-4 text-right text-emerald-500">+₹{transaction.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                  <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
                <p>
                  Page {page} of {totalPages}
                </p>
                <Button variant="outline" disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="debits" className="mt-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Transaction ID</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Description</th>
                      <th className="text-right py-3 px-4 font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions
                      .filter((transaction) => transaction.type === "debit")
                      .map((transaction) => (
                        <tr key={transaction.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-3 px-4">{transaction.transactionId}</td>
                          <td className="py-3 px-4">{transaction.date}</td>
                          <td className="py-3 px-4">{transaction.description}</td>
                          <td className="py-3 px-4 text-right text-red-500">-₹{transaction.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                  <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
                <p>
                  Page {page} of {totalPages}
                </p>
                <Button variant="outline" disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
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