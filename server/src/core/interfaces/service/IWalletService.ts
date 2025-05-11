import { IMentorWallet } from "../../../models/MentorWallet";
import { IPayoutRequest } from "../../../models/PayoutRequest";

export interface IWalletService {
  getTransactions(mentorId: string, page: number, limit: number): Promise<{ transactions: IMentorWallet[]; total: number }>;
  getBalance(mentorId: string): Promise<number>;
  withdrawFunds(mentorId: string, amount: number, description: string, paymentMethod: string, paymentDetails: any): Promise<IMentorWallet>;
  getPayoutRequests(status: string | undefined, page: number, limit: number): Promise<{ requests: IPayoutRequest[]; total: number }>;
  updatePayoutStatus(requestId: string, status: "paid" | "rejected", adminNotes: string): Promise<IPayoutRequest>;
}
