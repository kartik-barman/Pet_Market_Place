import mongoose from "mongoose";

const subsriberSchema = mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    }
})

export const Subscriber = mongoose.model("subscriber", subsriberSchema)