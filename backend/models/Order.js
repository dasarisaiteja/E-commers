import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
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
  imageUrl: {
    type: String,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    paymentStatus: {
      type: String,
      required: true,
      default: 'Pending', // e.g. Pending, Paid, Failed
    },
    orderStatus: {
      type: String,
      required: true,
      default: 'Processing', // e.g. Processing, Shipped, Delivered
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
