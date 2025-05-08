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
    const { amount, description } = req.body;

    if (!mentorId) {
      res.status(400).json({ error: "Mentor ID is required" });
      return;
    }

    if (!amount || typeof amount !== "number" || amount <= 0) {
      res.status(400).json({ error: "Valid withdrawal amount is required" });
      return;
    }

    const transaction = await this.walletService.withdrawFunds(mentorId, amount, description);
    res.status(200).json({ transaction });
  });
}
