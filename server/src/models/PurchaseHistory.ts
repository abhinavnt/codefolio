import mongoose, { Schema, Document } from "mongoose";

export interface IPurchaseHistory extends Document {
  userId: mongoose.Types.ObjectId;
  purchaseType: "course" | "mentorSlot";
  itemId: mongoose.Types.ObjectId;
  invoiceId: string;
  title: string;
  image?: string;
  price: number;
  status: "Completed" | "Pending" | "Failed" | "Refunded";
  purchaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseHistorySchema = new Schema<IPurchaseHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    purchaseType: { type: String, enum: ["course", "mentorSlot"], required: true },
    itemId: { type: Schema.Types.ObjectId, required: true }, // References Course or MentorSlot
    invoiceId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Completed", "Pending", "Failed", "Refunded"],
      default: "Pending",
    },
    purchaseDate: { type: Date, required: true },
  },
  { timestamps: true }
);

// Ensure unique combination of user, purchaseType, and itemId

export const PurchaseHistoryModel = mongoose.model<IPurchaseHistory>("PurchaseHistory", PurchaseHistorySchema);