import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// @desc    Fetch all products with search and filter parameters
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sortBy } = req.query;
    
    // Build query object
    let query = {};

    // 1. Text Search (name or description)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // 2. Category Filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // 3. Price Range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Build sorting parameters
    let sortOptions = {};
    if (sortBy) {
      if (sortBy === 'price-low') {
        sortOptions.price = 1;
      } else if (sortBy === 'price-high') {
        sortOptions.price = -1;
      } else if (sortBy === 'rating') {
        sortOptions.rating = -1;
      } else {
        sortOptions.createdAt = -1; // Newest first by default
      }
    } else {
      sortOptions.createdAt = -1;
    }

    const products = await Product.find(query).sort(sortOptions);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
