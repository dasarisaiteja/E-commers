import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  const { orderItems, totalAmount } = req.body;

  try {
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    // Optional: Verify pricing and stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.stockCount < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product ${item.name}` });
      }
      // Decrement stock count
      product.stockCount -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      totalAmount,
      paymentStatus: 'Paid', // Assuming simulated payment is successful
      orderStatus: 'Processing',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/user
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
