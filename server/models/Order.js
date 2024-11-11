import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Pet",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Cash on Delivery"],
    },
    shippingAddress: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,

        required: true,
      },
      dist: {
        type: String,
        required: true,
      },
      zip: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    orderStatus: {
      type: String,
      enum: ["Ordered", "Shipped","Out for delivery", "Delivered", "Cancelled"],
      default: "Ordered",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
