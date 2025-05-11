"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface WithdrawModalProps {
    isOpen: boolean
    onClose: () => void
    onWithdraw: (amount: number, paymentMethod: string, paymentDetails: any) => Promise<void>
    balance: number
}

export function WithdrawModal({ isOpen, onClose, onWithdraw, balance }: WithdrawModalProps) {
    const [amount, setAmount] = useState<string>("")
    const [paymentMethod, setPaymentMethod] = useState<string>("upi")
    const [upiId, setUpiId] = useState<string>("")
    const [accountNumber, setAccountNumber] = useState<string>("")
    const [ifscCode, setIfscCode] = useState<string>("")
    const [accountName, setAccountName] = useState<string>("")
    const [bankName, setBankName] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    const handleSubmit = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            toast.error("Please enter a valid withdrawal amount", {
                description: "Amount must be a positive number",
            })
            return
        }

        if (Number(amount) > balance) {
            toast.error("Insufficient balance", {
                description: `You cannot withdraw more than ₹${balance.toFixed(2)}`,
            })
            return
        }

        let paymentDetails = {}
        let isValid = true
        let errorMessage = ""

        if (paymentMethod === "upi") {
            if (!upiId || !upiId.includes("@")) {
                isValid = false
                errorMessage = "Please enter a valid UPI ID (e.g., yourname@upi)"
            }
            paymentDetails = { upiId }
        } else if (paymentMethod === "bank") {
            if (!accountNumber || accountNumber.length < 9) {
                isValid = false
                errorMessage = "Please enter a valid account number (minimum 9 digits)"
            } else if (!ifscCode || ifscCode.length !== 11) {
                isValid = false
                errorMessage = "Please enter a valid IFSC code (11 characters)"
            } else if (!accountName) {
                isValid = false
                errorMessage = "Please enter the account holder name"
            } else if (!bankName) {
                isValid = false
                errorMessage = "Please enter the bank name"
            }
            paymentDetails = { accountNumber, ifscCode, accountName, bankName }
        }

        if (!isValid) {
            toast.error(errorMessage, {
                description: "Invalid payment details",
            })
            return
        }

        setLoading(true)
        try {
            await onWithdraw(Number(amount), paymentMethod, paymentDetails)
            toast.success(`Your withdrawal request of ₹${Number(amount).toFixed(2)} has been submitted`, {
                description: "The request is pending admin approval",
            })
            resetForm()
            onClose()
        } catch (error: any) {
            toast.error(error.message || "An error occurred while processing your withdrawal", {
                description: "Please try again later",
            })
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setAmount("")
        setPaymentMethod("upi")
        setUpiId("")
        setAccountNumber("")
        setIfscCode("")
        setAccountName("")
        setBankName("")
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Withdraw Funds</DialogTitle>
                    <DialogDescription>
                        Enter the amount and payment details to withdraw funds from your wallet.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="pl-8"
                                placeholder="Enter amount to withdraw"
                                min="1"
                                step="0.01"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">Available balance: ₹{balance.toFixed(2)}</p>
                    </div>

                    <div className="grid gap-2">
                        <Label>Payment Method</Label>
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="upi" id="upi" />
                                <Label htmlFor="upi" className="cursor-pointer">
                                    UPI
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="bank" id="bank" />
                                <Label htmlFor="bank" className="cursor-pointer">
                                    Bank Transfer
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {paymentMethod === "upi" && (
                        <div className="grid gap-2">
                            <Label htmlFor="upiId">UPI ID</Label>
                            <Input
                                id="upiId"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="yourname@upi"
                            />
                        </div>
                    )}

                    {paymentMethod === "bank" && (
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="accountName">Account Holder Name</Label>
                                <Input
                                    id="accountName"
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    placeholder="Enter account holder name"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="bankName">Bank Name</Label>
                                <Input
                                    id="bankName"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    placeholder="Enter bank name"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="accountNumber">Account Number</Label>
                                <Input
                                    id="accountNumber"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    placeholder="Enter account number"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="ifscCode">IFSC Code</Label>
                                <Input
                                    id="ifscCode"
                                    value={ifscCode}
                                    onChange={(e) => setIfscCode(e.target.value)}
                                    placeholder="Enter IFSC code"
                                />
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? "Processing..." : "Submit Request"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}