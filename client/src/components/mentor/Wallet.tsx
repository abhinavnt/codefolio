"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownIcon, ArrowUpIcon, DollarSign } from "lucide-react"

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: "credit" | "debit"
}

// Dummy data for transactions
const dummyTransactions: Transaction[] = [
  {
    id: "t1",
    date: "01 Apr 2025",
    description: "Payment Received",
    amount: 100,
    type: "credit",
  },
  {
    id: "t2",
    date: "15 Mar 2025",
    description: "Payment Received",
    amount: 150,
    type: "credit",
  },
  {
    id: "t3",
    date: "01 Mar 2025",
    description: "Payment Received",
    amount: 100,
    type: "credit",
  },
  {
    id: "t4",
    date: "15 Feb 2025",
    description: "Withdrawal to Bank Account",
    amount: 200,
    type: "debit",
  },
  {
    id: "t5",
    date: "01 Feb 2025",
    description: "Payment Received",
    amount: 125,
    type: "credit",
  },
  {
    id: "t6",
    date: "15 Jan 2025",
    description: "Payment Received",
    amount: 75,
    type: "credit",
  },
]

export function Wallet() {
  const balance = dummyTransactions.reduce((total, transaction) => {
    return transaction.type === "credit" ? total + transaction.amount : total - transaction.amount
  }, 0)

  return (
    <div>comming soon</div>
    // <div className="space-y-6">
    //   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    //     <Card className="md:col-span-2">
    //       <CardHeader>
    //         <CardTitle>Wallet Balance</CardTitle>
    //         <CardDescription>Your current balance and payment options</CardDescription>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
    //           <div className="mb-4 md:mb-0">
    //             <p className="text-sm text-gray-500 mb-1">Available Balance</p>
    //             <h2 className="text-4xl font-bold text-emerald-500">${balance.toFixed(2)}</h2>
    //           </div>
    //           <div className="flex flex-col sm:flex-row gap-2">
    //             <Button className="bg-emerald-500 hover:bg-emerald-600">Withdraw Funds</Button>
    //             <Button variant="outline">Payment Settings</Button>
    //           </div>
    //         </div>
    //       </CardContent>
    //     </Card>

    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Payment Stats</CardTitle>
    //         <CardDescription>Your payment statistics</CardDescription>
    //       </CardHeader>
    //       <CardContent>
    //         <div className="space-y-4">
    //           <div className="flex items-center justify-between">
    //             <div>
    //               <p className="text-sm text-gray-500">Total Earned</p>
    //               <p className="text-xl font-bold">$550.00</p>
    //             </div>
    //             <div className="rounded-full bg-emerald-100 p-2">
    //               <DollarSign className="h-5 w-5 text-emerald-500" />
    //             </div>
    //           </div>

    //           <div className="flex items-center justify-between">
    //             <div>
    //               <p className="text-sm text-gray-500">This Month</p>
    //               <p className="text-xl font-bold">$100.00</p>
    //             </div>
    //             <div className="rounded-full bg-blue-100 p-2">
    //               <ArrowUpIcon className="h-5 w-5 text-blue-500" />
    //             </div>
    //           </div>

    //           <div className="flex items-center justify-between">
    //             <div>
    //               <p className="text-sm text-gray-500">Pending</p>
    //               <p className="text-xl font-bold">$75.00</p>
    //             </div>
    //             <div className="rounded-full bg-amber-100 p-2">
    //               <ArrowDownIcon className="h-5 w-5 text-amber-500" />
    //             </div>
    //           </div>
    //         </div>
    //       </CardContent>
    //     </Card>
    //   </div>

    //   <Card>
    //     <CardHeader>
    //       <CardTitle>Transaction History</CardTitle>
    //       <CardDescription>Your recent transactions and payment history</CardDescription>
    //     </CardHeader>
    //     <CardContent>
    //       <Tabs defaultValue="all">
    //         <TabsList className="mb-4">
    //           <TabsTrigger value="all">All</TabsTrigger>
    //           <TabsTrigger value="credits">Credits</TabsTrigger>
    //           <TabsTrigger value="debits">Debits</TabsTrigger>
    //         </TabsList>

    //         <TabsContent value="all" className="mt-0">
    //           <div className="overflow-x-auto">
    //             <table className="w-full">
    //               <thead>
    //                 <tr className="border-b">
    //                   <th className="text-left py-3 px-4 font-medium">Date</th>
    //                   <th className="text-left py-3 px-4 font-medium">Description</th>
    //                   <th className="text-right py-3 px-4 font-medium">Amount</th>
    //                 </tr>
    //               </thead>
    //               <tbody>
    //                 {dummyTransactions.map((transaction) => (
    //                   <tr key={transaction.id} className="border-b last:border-0 hover:bg-gray-50">
    //                     <td className="py-3 px-4">{transaction.date}</td>
    //                     <td className="py-3 px-4">{transaction.description}</td>
    //                     <td
    //                       className={`py-3 px-4 text-right ${transaction.type === "credit" ? "text-emerald-500" : "text-red-500"}`}
    //                     >
    //                       {transaction.type === "credit" ? "+" : "-"}${transaction.amount.toFixed(2)}
    //                     </td>
    //                   </tr>
    //                 ))}
    //               </tbody>
    //             </table>
    //           </div>
    //         </TabsContent>

    //         <TabsContent value="credits" className="mt-0">
    //           <div className="overflow-x-auto">
    //             <table className="w-full">
    //               <thead>
    //                 <tr className="border-b">
    //                   <th className="text-left py-3 px-4 font-medium">Date</th>
    //                   <th className="text-left py-3 px-4 font-medium">Description</th>
    //                   <th className="text-right py-3 px-4 font-medium">Amount</th>
    //                 </tr>
    //               </thead>
    //               <tbody>
    //                 {dummyTransactions
    //                   .filter((transaction) => transaction.type === "credit")
    //                   .map((transaction) => (
    //                     <tr key={transaction.id} className="border-b last:border-0 hover:bg-gray-50">
    //                       <td className="py-3 px-4">{transaction.date}</td>
    //                       <td className="py-3 px-4">{transaction.description}</td>
    //                       <td className="py-3 px-4 text-right text-emerald-500">+${transaction.amount.toFixed(2)}</td>
    //                     </tr>
    //                   ))}
    //               </tbody>
    //             </table>
    //           </div>
    //         </TabsContent>

    //         <TabsContent value="debits" className="mt-0">
    //           <div className="overflow-x-auto">
    //             <table className="w-full">
    //               <thead>
    //                 <tr className="border-b">
    //                   <th className="text-left py-3 px-4 font-medium">Date</th>
    //                   <th className="text-left py-3 px-4 font-medium">Description</th>
    //                   <th className="text-right py-3 px-4 font-medium">Amount</th>
    //                 </tr>
    //               </thead>
    //               <tbody>
    //                 {dummyTransactions
    //                   .filter((transaction) => transaction.type === "debit")
    //                   .map((transaction) => (
    //                     <tr key={transaction.id} className="border-b last:border-0 hover:bg-gray-50">
    //                       <td className="py-3 px-4">{transaction.date}</td>
    //                       <td className="py-3 px-4">{transaction.description}</td>
    //                       <td className="py-3 px-4 text-right text-red-500">-${transaction.amount.toFixed(2)}</td>
    //                     </tr>
    //                   ))}
    //               </tbody>
    //             </table>
    //           </div>
    //         </TabsContent>
    //       </Tabs>
    //     </CardContent>
    //   </Card>
    // </div>
  )
}

