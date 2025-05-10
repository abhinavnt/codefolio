import { IMentorWallet } from "../../../models/MentorWallet";



export interface IMentorWalletRepository {
    createTransaction(data: {
      mentorId: string;
      date: Date;
      description: string;
      amount: number;
      type: "credit" | "debit";
    }): Promise<IMentorWallet>;
    getTransactions(mentorId: string, page: number, limit: number): Promise<{ transactions: IMentorWallet[]; total: number }>;
    getBalance(mentorId: string): Promise<number>;
    getDashboardWalletTransactions(mentorId: string):Promise<any>
    getDashboardWalletTransactions(mentorId: string, startDate?: Date, endDate?: Date): Promise<any>
  }