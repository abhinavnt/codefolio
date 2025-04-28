import mongoose, { Document, Schema, Types } from "mongoose";

export interface IWishlist extends Document {
  userId: Types.ObjectId;
  courseIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    courseIds: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

export const Wishlist = mongoose.model<IWishlist>("Wishlist", WishlistSchema);
