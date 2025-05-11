import mongoose, { FilterQuery } from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IPayoutRequestRepository } from "../core/interfaces/repository/IPayoutRequest";
import { IPayoutRequest, PayoutRequest } from "../models/PayoutRequest";

export class PayoutRequestRepository extends BaseRepository<IPayoutRequest> implements IPayoutRequestRepository {
  constructor() {
    super(PayoutRequest);
  }

  async createPayoutRequest(
    mentorId: string,
    amount: number,
    paymentMethod: string,
    paymentDetails: any,
    status: string,
    requestedAt: Date
  ): Promise<IPayoutRequest> {
    const payoutRequest = new this.model({
      mentorId,
      amount,
      paymentMethod,
      paymentDetails,
      status,
      requestedAt,
    });

    return payoutRequest.save();
  }

  async getPayoutRequests(query: FilterQuery<IPayoutRequest>, page: number, limit: number): Promise<{ requests: IPayoutRequest[]; total: number }> {
    const skip = (page - 1) * limit;
    const total = await this.countDocuments(query);
    const requests = await this.find(query).populate("mentorId", "name email").skip(skip).limit(limit).sort({ requestedAt: -1 });

    return { requests, total };
  }

  async updatePayoutRequest(requestId: string, update: Partial<IPayoutRequest>): Promise<IPayoutRequest | null> {
       return await this.findByIdAndUpdate(new mongoose.Types.ObjectId(requestId), update, { new: true })
  }

  async findPayoutRequestById(requestId: string): Promise<IPayoutRequest | null> {
      return await this.findById(new mongoose.Types.ObjectId(requestId))
  }
}
