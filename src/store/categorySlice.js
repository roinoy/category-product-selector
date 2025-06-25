import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async () => {
        // בדיקה אם אנחנו ב-localhost או ב-IP מקומי
        const hostname = window.location.hostname;

        // פונקציה קטנה לבדיקת IP מקומי (private IP ranges)
        function isLocalIP(ip) {
            return (
                ip === 'localhost' ||
                ip === '127.0.0.1' ||
                ip.startsWith('192.168.') ||
                ip.startsWith('10.') ||
                ip.startsWith('172.') // אפשר להוסיף גם טווח 172.16.0.0 עד 172.31.255.255 במידת הצורך
            );
        }

        const baseUrl = isLocalIP(hostname)
            ? 'http://localhost:3033'
            : 'https://tjdavpjfkbpgrbdhxunjpx7ita0tqcit.lambda-url.eu-central-1.on.aws';

        const response = await fetch(`${baseUrl}/products`);
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
