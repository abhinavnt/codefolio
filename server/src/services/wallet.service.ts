import { inject, injectable } from "inversify";
import { IWalletService } from "../core/interfaces/service/IWalletService";
import { TYPES } from "../di/types";
import { IMentorWalletRepository } from "../core/interfaces/repository/IMentorWalletRepository";
import { IMentorWallet } from "../models/MentorWallet";
import { IPayoutRequestRepository } from "../core/interfaces/repository/IPayoutRequest";
import { IPayoutRequest } from "../models/PayoutRequest";
import { FilterQuery } from "mongoose";

@injectable()
export class WalletService implements IWalletService {
  constructor(
    @inject(TYPES.MentorWalletRepository) private mentorWalletRepository: IMentorWalletRepository,
    @inject(TYPES.PayoutRequestRepository) private payoutRepository: IPayoutRequestRepository
  ) {}

  async getTransactions(mentorId: string, page: number, limit: number): Promise<{ transactions: IMentorWallet[]; total: number }> {
    return await this.mentorWalletRepository.getTransactions(mentorId, page, limit);
  }

  async getBalance(mentorId: string): Promise<number> {
    return await this.mentorWalletRepository.getBalance(mentorId);
  }

  async withdrawFunds(mentorId: string, amount: number, description: string, paymentMethod: string, paymentDetails: IPayoutRequest): Promise<IMentorWallet> {
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be positive");
    }

    const balance = await this.getBalance(mentorId);
    if (balance < amount) {
      throw new Error("Insufficient balance for withdrawal");
    }

    await this.payoutRepository.createPayoutRequest(mentorId, amount, paymentMethod, paymentDetails, "pending", new Date());

    return await this.mentorWalletRepository.createTransaction({
      mentorId,
      date: new Date(),
      description,
      amount,
      type: "debit",
    });
  }

  //payout request
  async getPayoutRequests(status: string | undefined, page: number, limit: number): Promise<{ requests: IPayoutRequest[]; total: number }> {
    const query: FilterQuery<IPayoutRequest> = {};
    if (status && ["pending", "paid", "rejected"].includes(status)) {
      query.status = status;
    }

    return await this.payoutRepository.getPayoutRequests(query, page, limit);
  }

  async updatePayoutStatus(requestId: string, status: "paid" | "rejected", adminNotes: string): Promise<IPayoutRequest> {
    if (!["paid", "rejected"].includes(status)) {
      throw new Error("Invalid status");
    }

    const payoutRequest = await this.payoutRepository.findPayoutRequestById(requestId);
    if (!payoutRequest) {
      throw new Error("Payout request not found");
    }

    const updatedRequest = await this.payoutRepository.updatePayoutRequest(requestId, {
      status,
      processedAt: new Date(),
      adminNotes,
    });

    if (!updatedRequest) {
      throw new Error("Failed to update payout request");
    }

    if (status === "rejected") {
      const description = `Payout request ${payoutRequest.requestId} rejected by admin${adminNotes ? `: ${adminNotes}` : ""}`;
      await this.mentorWalletRepository.createTransaction({
        mentorId: payoutRequest.mentorId.toString(),
        date: new Date(),
        description,
        amount: payoutRequest.amount,
        type: "credit",
      });
    }

    return updatedRequest;
  }
}
