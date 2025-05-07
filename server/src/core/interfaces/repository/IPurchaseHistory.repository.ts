import { IPurchaseHistory } from "../../../models/PurchaseHistory";


export interface IPurchaseHistoryRepository{
    createPurchaseHistory(data: {
        userId: string;
        purchaseType: "course" | "mentorSlot";
        itemId: string;
        invoiceId: string;
        title: string;
        image?: string;
        price: number;
        status: "Completed" | "Pending" | "Failed" | "Refunded";
        purchaseDate: Date;
      }): Promise<IPurchaseHistory>

      findByUserId(userId: string): Promise<IPurchaseHistory[]>
}