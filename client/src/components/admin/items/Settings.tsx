"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import axiosInstance from "@/utils/axiosInstance"
import { toast } from "sonner"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PayoutRequest {
  _id: string;
  requestId: string;
  mentorId: { name: string; email: string };
  amount: number;
  paymentMethod: string;
  paymentDetails: {
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
    accountName?: string;
    upiId?: string;
  };
  status: "pending" | "paid" | "rejected";
  requestedAt: string;
  processedAt?: string;
  adminNotes?: string;
}

export function Settings() {
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([])
  const [total, setTotal] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [isActionModalOpen, setIsActionModalOpen] = useState<boolean>(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false)
  const [selectedRequest, setSelectedRequest] = useState<PayoutRequest | null>(null)
  const [actionType, setActionType] = useState<"paid" | "rejected" | null>(null)
  const [adminNotes, setAdminNotes] = useState<string>("")
  const limit = 10

  const fetchPayoutRequests = async (status: string) => {
    try {
      const response = await axiosInstance.get("/api/wallet/payout", {
        params: { page, limit, status },
      })
      setPayoutRequests(response.data.requests)
      setTotal(response.data.total)
    } catch (error) {
      toast.error( "Error fetching payout requests")
    }
  }

  useEffect(() => {
    fetchPayoutRequests("pending")
  }, [page])

  const openActionModal = (request: PayoutRequest, action: "paid" | "rejected") => {
    setSelectedRequest(request)
    setActionType(action)
    setAdminNotes(request.adminNotes || "")
    setIsActionModalOpen(true)
  }

  const openConfirmModal = () => {
    setIsActionModalOpen(false)
    setIsConfirmModalOpen(true)
  }

  const handleStatusUpdate = async () => {
    if (!selectedRequest || !actionType) return

    try {
      const response = await axiosInstance.patch(`/api/wallet/${selectedRequest._id}/status`, {
        status: actionType,
        adminNotes: adminNotes,
      })
      toast.success(`Payout request ${actionType} successfully`, {
        description: `Request ID: ${selectedRequest.requestId}`,
      })
      setPayoutRequests((prev) =>
        prev.map((req) => (req._id === selectedRequest._id ? response.data.request : req))
      )
      setIsConfirmModalOpen(false)
      setIsActionModalOpen(false)
      setSelectedRequest(null)
      setActionType(null)
      setAdminNotes("")
    } catch (error) {
      toast.error( `Error updating payout status to ${actionType}`)
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Payout Management</h2>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="pending"
            onClick={() => {
              setPage(1)
              fetchPayoutRequests("pending")
            }}
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="paid"
            onClick={() => {
              setPage(1)
              fetchPayoutRequests("paid")
            }}
          >
            Paid
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            onClick={() => {
              setPage(1)
              fetchPayoutRequests("rejected")
            }}
          >
            Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Payout Requests</CardTitle>
              <CardDescription>Review and process pending payout requests from mentors</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Payment Details</TableHead>
                    <TableHead>Requested At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payoutRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>{request.requestId}</TableCell>
                      <TableCell>
                        {request.mentorId.name} <br />
                        <span className="text-sm text-muted-foreground">{request.mentorId.email}</span>
                      </TableCell>
                      <TableCell>₹{request.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge>{request.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell>
                        {request.paymentMethod === "bank" && (
                          <>
                            Bank: {request.paymentDetails.bankName} <br />
                            A/C: {request.paymentDetails.accountNumber} <br />
                            IFSC: {request.paymentDetails.ifscCode} <br />
                            Name: {request.paymentDetails.accountName}
                          </>
                        )}
                        {request.paymentMethod === "upi" && <>UPI: {request.paymentDetails.upiId}</>}
                      </TableCell>
                      <TableCell>{new Date(request.requestedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => openActionModal(request, "paid")}
                            disabled={request.status !== "pending"}
                          >
                            Mark as Paid
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => openActionModal(request, "rejected")}
                            disabled={request.status !== "pending"}
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                  <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
                <p>Page {page} of {totalPages}</p>
                <Button variant="outline" disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid">
          <Card>
            <CardHeader>
              <CardTitle>Paid Payout Requests</CardTitle>
              <CardDescription>View processed payout requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Processed At</TableHead>
                    <TableHead>Admin Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payoutRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>{request.requestId}</TableCell>
                      <TableCell>
                        {request.mentorId.name} <br />
                        <span className="text-sm text-muted-foreground">{request.mentorId.email}</span>
                      </TableCell>
                      <TableCell>₹{request.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge>{request.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell>
                        {request.processedAt ? new Date(request.processedAt).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell>{request.adminNotes || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                  <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
                <p>Page {page} of {totalPages}</p>
                <Button variant="outline" disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Payout Requests</CardTitle>
              <CardDescription>View rejected payout requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Mentor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Processed At</TableHead>
                    <TableHead>Admin Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payoutRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>{request.requestId}</TableCell>
                      <TableCell>
                        {request.mentorId.name} <br />
                        <span className="text-sm text-muted-foreground">{request.mentorId.email}</span>
                      </TableCell>
                      <TableCell>₹{request.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge>{request.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell>
                        {request.processedAt ? new Date(request.processedAt).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell>{request.adminNotes || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-4">
                <Button variant="outline" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
                  <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
                <p>Page {page} of {totalPages}</p>
                <Button variant="outline" disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Modal */}
      {selectedRequest && actionType && (
        <Dialog open={isActionModalOpen} onOpenChange={(open) => !open && setIsActionModalOpen(false)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {actionType === "paid" ? "Mark Payout as Paid" : "Reject Payout Request"}
              </DialogTitle>
              <DialogDescription>
                {actionType === "paid"
                  ? "Confirm that the payout has been processed and add any notes."
                  : "Reject the payout request and provide a reason for rejection."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Request Details</Label>
                <div className="text-sm text-muted-foreground">
                  <p>Request ID: {selectedRequest.requestId}</p>
                  <p>Mentor: {selectedRequest.mentorId.name} ({selectedRequest.mentorId.email})</p>
                  <p>Amount: ₹{selectedRequest.amount.toFixed(2)}</p>
                  <p>Payment Method: {selectedRequest.paymentMethod}</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Payment Details</Label>
                <div className="text-sm text-muted-foreground">
                  {selectedRequest.paymentMethod === "bank" && (
                    <>
                      <p>Bank: {selectedRequest.paymentDetails.bankName}</p>
                      <p>Account Number: {selectedRequest.paymentDetails.accountNumber}</p>
                      <p>IFSC Code: {selectedRequest.paymentDetails.ifscCode}</p>
                      <p>Account Holder: {selectedRequest.paymentDetails.accountName}</p>
                    </>
                  )}
                  {selectedRequest.paymentMethod === "upi" && (
                    <p>UPI ID: {selectedRequest.paymentDetails.upiId}</p>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <Textarea
                  id="adminNotes"
                  placeholder={actionType === "paid" ? "Add notes (optional)" : "Reason for rejection"}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsActionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant={actionType === "paid" ? "default" : "destructive"}
                onClick={openConfirmModal}
              >
                {actionType === "paid" ? "Mark as Paid" : "Reject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Confirmation Modal */}
      {selectedRequest && actionType && (
        <Dialog open={isConfirmModalOpen} onOpenChange={(open) => !open && setIsConfirmModalOpen(false)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm {actionType === "paid" ? "Payment" : "Rejection"}</DialogTitle>
              <DialogDescription>
                Are you sure you want to {actionType === "paid" ? "mark this payout request as paid" : "reject this payout request"}?
                <br />
                Request ID: {selectedRequest.requestId}
                <br />
                {adminNotes && (
                  <>
                    Notes: {adminNotes}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant={actionType === "paid" ? "default" : "destructive"}
                onClick={handleStatusUpdate}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}