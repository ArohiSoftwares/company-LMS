import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({

    studentEmail : {
        type : String,
        // required : true
    },

    courseName : {
        type : String,
        // required : true
    },

    courseCode : {
        type : String,
        // required : true
    },

    razorpay_order_id : {
        type : String,
        // required : true
    },

    razorpay_payment_id : {
        type : String,
        required : true
    },

    transactionDate : {
        type : Date,
        default : Date.now(),
        // required : true
    },

    razorpay_signature : {
        type : String,
        required : true
    },

    amount : {
        type : Number,
        // required : true
    },

    status : {
        type : String,
        enum : ['pending', 'paid', 'failed'],
        default : 'pending'
    },




}, {timestamps: true});




export const Payment = mongoose.model("Payment", paymentSchema);