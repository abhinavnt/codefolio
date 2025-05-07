import mongoose from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IPurchaseHistoryRepository } from "../core/interfaces/repository/IPurchaseHistory.repository";
import { IPurchaseHistory, PurchaseHistoryModel } from "../models/PurchaseHistory";

export class PurchaseHistoryRepository extends BaseRepository<IPurchaseHistory> implements IPurchaseHistoryRepository {
  constructor() {
    super(PurchaseHistoryModel);
  }

  async createPurchaseHistory(data: {
    userId: string;
    purchaseType: "course" | "mentorSlot";
    itemId: string;
    invoiceId: string;
    title: string;
    image?: string;
    price: number;
    status: "Completed" | "Pending" | "Failed" | "Refunded";
    purchaseDate: Date;
  }): Promise<IPurchaseHistory> {
    const purchase = new this.model({
      userId: new mongoose.Types.ObjectId(data.userId),
      purchaseType: data.purchaseType,
      itemId: new mongoose.Types.ObjectId(data.itemId),
      invoiceId: data.invoiceId,
      title: data.title,
      image: data.image,
      price: data.price,
      status: data.status,
      purchaseDate: data.purchaseDate,
    });
    return await purchase.save();
  }

  async findByUserId(userId: string): Promise<IPurchaseHistory[]> {
    return await this.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ purchaseDate: -1 })
      .exec();
  }

  



}
