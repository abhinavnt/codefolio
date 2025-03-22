import mongoose, { Document, Schema } from "mongoose";

export interface IAdmin extends Document{
     name:string,
     email:string,
     password:string,
     createdAt:Date,
     updatedAt:Date
}

const AdminShema = new Schema(
    {
        name:{type:String, required:true},
        email:{type:String, required:true, unique:true},
        password:{type:String, required:true}
    },
    {timestamps:true}
)

export const Admin = mongoose.model("Admin",AdminShema)