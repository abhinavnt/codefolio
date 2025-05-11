import { FilterQuery } from "mongoose";
import { IPayoutRequest } from "../../../models/PayoutRequest";

export interface IPayoutRequestRepository {
  createPayoutRequest(
    mentorId: string,
    amount: number,
    paymentMethod: string,
    paymentDetails: any,
    status: string,
    requestedAt: Date
  ): Promise<IPayoutRequest>;
  getPayoutRequests(query: FilterQuery<IPayoutRequest>, page: number, limit: number): Promise<{ requests: IPayoutRequest[]; total: number }>;
  updatePayoutRequest(requestId: string, update: Partial<IPayoutRequest>): Promise<IPayoutRequest | null>;
  findPayoutRequestById(requestId: string): Promise<IPayoutRequest | null>
}
