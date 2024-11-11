import mongoose from "mongoose";


const cartSchema = new mongoose.Schema({
    item: {
      type: mongoose.Types.ObjectId, 
      ref: 'Pet', 
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    price: {
      type: Number,
      required: true,
    },
    
  })

const userSchema = new mongoose.Schema({
    role : {
        type : String,
        required : true,
       enum : ["Buyer", "Seller", "admin"] 
    },
    avatar : {
        type : String
    },
    banner : {
        type : String
    },
    about : {
        type : String
    },
    location : {
        type : String
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone : {
        type : String,
        required : true
    },
    password: {
        type: String,
        required: true
    },
    cart : [cartSchema],
    orders : [{
        type : mongoose.Types.ObjectId,
        ref : "Order"
    }],
    pets : [{
        type : mongoose.Types.ObjectId,
        ref : "Pet"
      }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const User = mongoose.model('User', userSchema);