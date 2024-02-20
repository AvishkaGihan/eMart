import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    // user is the user who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // orderItems is an array of objects
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    // shippingAddress is an object
    shippingAddress: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    // paymentMethod is a string
    paymentMethod: {
      type: String,
      required: true,
    },
    // paymentResult is an object
    paymentResult: {
      id: {
        type: String,
      },
      status: {
        type: String,
      },
      update_time: {
        type: String,
      },
      email_address: {
        type: String,
      },
    },
    // itemsPrice is a number
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    // taxPrice is a number
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    // shippingPrice is a number
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    // totalPrice is a number
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    // isPaid is a boolean
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    // paidAt is a date
    paidAt: {
      type: Date,
    },
    // isDelivered is a boolean
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    // deliveredAt is a date
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
