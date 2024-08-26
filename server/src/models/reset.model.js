import mongoose from "mongoose";



const ForgetPasswordTokenSchema =  new mongoose.Schema({
    email:{
        type:String
    },
    token:{
        type:String
    }
})


export const ForgetPasswordToken = mongoose.model("ForgetPasswordToken",ForgetPasswordTokenSchema);