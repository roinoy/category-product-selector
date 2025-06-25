import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

//Async thunk to fetch categories from API
export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async () => {
        const response = await fetch('https://tjdavpjfkbpgrbdhxunjpx7ita0tqcit.lambda-url.eu-central-1.on.aws/products');
        const data = await response.json();
        return data;
    }
);


const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    selectedCategoryId: null,
    selectedProductId: null,
    status: 'idle',
    error: null,
    cart: [], // 🛒 added cart state
  },
  reducers: {
    setSelectedCategory(state, action) {
      state.selectedCategoryId = action.payload;
      state.selectedProductId = null; // reset product when category changes
    },
    setSelectedProduct(state, action) {
      state.selectedProductId = action.payload;
    },
    addToCart(state, action) {
      const { product, quantity } = action.payload;
      const existingItem = state.cart.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({ ...product, quantity });
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export actions
export const {
  setSelectedCategory,
  setSelectedProduct,
  addToCart, // 🛒 export new action
} = categorySlice.actions;

export default categorySlice.reducer;
