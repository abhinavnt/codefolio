import mongoose from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IMentorWalletRepository } from "../core/interfaces/repository/IMentorWalletRepository";
import { IMentorWallet, MentorWallet } from "../models/MentorWallet";

export class MentorWalletRepository extends BaseRepository<IMentorWallet> implements IMentorWalletRepository {
  constructor() {
    super(MentorWallet);
  }

  async createTransaction(data: {
    mentorId: string;
    date: Date;
    description: string;
    amount: number;
    type: "credit" | "debit";
  }): Promise<IMentorWallet> {
    const transaction = new this.model({
      mentorId: new mongoose.Types.ObjectId(data.mentorId),
      date: data.date,
      description: data.description,
      amount: data.amount,
      type: data.type,
    });
    return await transaction.save();
  }

  async getTransactions(mentorId: string, page: number, limit: number): Promise<{ transactions: IMentorWallet[]; total: number }> {
    const skip = (page - 1) * limit;
    const transactions = await MentorWallet.find({ mentorId: new mongoose.Types.ObjectId(mentorId) })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    const total = await this.countDocuments({ mentorId: new mongoose.Types.ObjectId(mentorId) });
    return { transactions, total };
  }

  async getBalance(mentorId: string): Promise<number> {
    const result = await this.aggregate([
      { $match: { mentorId: new mongoose.Types.ObjectId(mentorId) } },
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $cond: [{ $eq: ["$type", "credit"] }, "$amount", { $multiply: ["$amount", -1] }],
            },
          },
        },
      },
    ]);
    return result.length > 0 ? result[0].total : 0;
  }

  
}
