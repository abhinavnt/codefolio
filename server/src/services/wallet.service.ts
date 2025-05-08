import { inject, injectable } from "inversify";
import { IWalletService } from "../core/interfaces/service/IWalletService";
import { TYPES } from "../di/types";
import { IMentorWalletRepository } from "../core/interfaces/repository/IMentorWalletRepository";
import { IMentorWallet } from "../models/MentorWallet";

@injectable()
export class WalletService implements IWalletService {
  constructor(@inject(TYPES.MentorWalletRepository) private mentorWalletRepository: IMentorWalletRepository) {}

  async getTransactions(mentorId: string, page: number, limit: number): Promise<{ transactions: IMentorWallet[]; total: number }> {
    return await this.mentorWalletRepository.getTransactions(mentorId, page, limit);
  }

  async getBalance(mentorId: string): Promise<number> {
    return await this.mentorWalletRepository.getBalance(mentorId);
  }

  async withdrawFunds(mentorId: string, amount: number, description: string): Promise<IMentorWallet> {
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be positive");
    }

    const balance = await this.getBalance(mentorId);
    if (balance < amount) {
      throw new Error("Insufficient balance for withdrawal");
    }

    return await this.mentorWalletRepository.createTransaction({
      mentorId,
      date: new Date(),
      description,
      amount,
      type: "debit",
    });
  }
}
