import { IMentorWallet } from "../../../models/MentorWallet";




export interface IWalletService{
    getTransactions(mentorId: string, page: number, limit: number): Promise<{ transactions: IMentorWallet[]; total: number }>
    getBalance(mentorId: string): Promise<number>
    withdrawFunds(mentorId: string, amount: number, description: string): Promise<IMentorWallet>
}