import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem('cart', JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item._id === product._id);
      
      if (existingItem) {
        existingItem.quantity += Number(quantity);
      } else {
        state.items.push({ ...product, quantity: Number(quantity) });
      }
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const parsedQuantity = Math.max(0, Number(quantity));
      
      if (parsedQuantity === 0) {
        state.items = state.items.filter((item) => item._id !== productId);
      } else {
        const item = state.items.find((item) => item._id === productId);
        if (item) {
          item.quantity = parsedQuantity;
        }
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item._id !== productId);
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage([]);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((acc, item) => acc + item.quantity, 0);
export const selectCartTotal = (state) => state.cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

export default cartSlice.reducer;
