import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  commentText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required : true
  },
  category: {
    type: String,
    required: true,
  },
  breed: {
    type : String,
    required : true
  },
  age: {
    type: String,
    required : true
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  images: [String],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [commentSchema],
  views: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  orders : [{
    type : mongoose.Types.ObjectId,
    ref : "User"
  }],
  rating: {
    type: Number,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Pet = mongoose.model("Pet", petSchema);
