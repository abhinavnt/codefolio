import mongoose, { Document, Schema,Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profileImageUrl: string;
  status:string;
  role: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  wishlist:Types.ObjectId[];
  savedMentors:Types.ObjectId[];
  skills:string[];
  DOB:Date;
  reviewerRequestStatus: ("pending" | "approved" | "rejected")[];
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String },
    role: { type: String, enum: ["user", "tutor"], default: "user" },
    status: {type:String, enum: ["active", "blocked"], default:"active"},
    title: { type: String },
    skills: [{ type: String }],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    savedMentors:[{type:Schema.Types.ObjectId,ref:"Mentor"}],
    DOB:{type:Date},
    reviewerRequestStatus:{type:[{type:String,enum:["pending","approved","rejected"]}],default:[]}
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);