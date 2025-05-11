import { inject, injectable } from "inversify";
import { IWalletController } from "../core/interfaces/controller/IWalletController";
import { TYPES } from "../di/types";
import { IWalletService } from "../core/interfaces/service/IWalletService";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

@injectable()
export class WalletController implements IWalletController {
  constructor(@inject(TYPES.WalletService) private walletService: IWalletService) {}

  getTransactions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!mentorId) {
      res.status(400).json({ error: "Mentor ID is required" });
      return;
    }

    const { transactions, total } = await this.walletService.getTransactions(mentorId, page, limit);
    res.status(200).json({ transactions, total, page, limit });
  });

  getBalance = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId } = req.params;

    if (!mentorId) {
      res.status(400).json({ error: "Mentor ID is required" });
      return;
    }

    const balance = await this.walletService.getBalance(mentorId);
    res.status(200).json({ balance });
  });

  withdrawFunds = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId } = req.params;
    const { amount, description, paymentMethod, paymentDetails } = req.body;

    if (!mentorId) {
      res.status(400).json({ error: "Mentor ID is required" });
      return;
    }

    if (!amount || typeof amount !== "number" || amount <= 0) {
      res.status(400).json({ error: "Valid withdrawal amount is required" });
      return;
    }

    if (!paymentMethod || !["bank", "upi"].includes(paymentMethod)) {
      res.status(400).json({ error: "Invalid payment method" });
      return;
    }

    if (!paymentDetails) {
      res.status(400).json({ error: "Payment details are required" });
      return;
    }

    if (paymentMethod === "upi") {
      if (!paymentDetails.upiId || !paymentDetails.upiId.includes("@")) {
        res.status(400).json({ error: "Valid UPI ID is required" });
        return;
      }
    } else if (paymentMethod === "bank") {
      if (
        !paymentDetails.accountNumber ||
        paymentDetails.accountNumber.length < 9 ||
        !paymentDetails.ifscCode ||
        paymentDetails.ifscCode.length < 11 ||
        !paymentDetails.accountName ||
        !paymentDetails.bankName
      ) {
        res.status(400).json({ error: "Complete bank details are required" });
        return;
      }
    }

    const transaction = await this.walletService.withdrawFunds(mentorId, amount, description, paymentMethod, paymentDetails);
    res.status(200).json({ transaction });
  });

  //payout
  getPayoutRequests = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const { requests, total } = await this.walletService.getPayoutRequests(status, page, limit);
    res.status(200).json({ requests, total, page, limit });
  });

  updatePayoutStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { requestId } = req.params;
    const { status, adminNotes } = req.body;

    const updatedRequest = await this.walletService.updatePayoutStatus(requestId, status, adminNotes);
    res.status(200).json({ request: updatedRequest, message: "Payout status updated successfully" });
  });
}
