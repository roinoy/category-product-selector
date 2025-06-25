import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchCategories,
    setSelectedCategory,
    setSelectedProduct,
    addToCart,
} from '../store/categorySlice';
import { useNavigate } from 'react-router-dom';

export default function ProductPage() {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    const {
        categories,
        selectedCategoryId,
        selectedProductId,
        status,
        error,
        cart,
    } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);
    const selectedProduct = selectedCategory?.products.find(
        (prod) => prod.id === selectedProductId
    );

    const handleAddToCart = () => {
        if (selectedProduct && quantity > 0) {
            dispatch(addToCart({ product: selectedProduct, quantity: Number(quantity) }));
            setQuantity(1);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '2rem', padding: '2rem' }}>
            {/* 👉 Left: Product form */}
            <div style={{ flex: 1 }}>
                <h2>בחר קטגוריה</h2>
                {status === 'loading' && <p>טוען קטגוריות...</p>}
                {error && <p style={{ color: 'red' }}>שגיאה: {error}</p>}

                <select
                    onChange={(e) => dispatch(setSelectedCategory(Number(e.target.value)))}
                    value={selectedCategoryId || ''}
                >
                    <option value="" disabled>
                        -- בחר קטגוריה --
                    </option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {selectedCategory && (
                    <>
                        <h2>בחר מוצר</h2>
                        <select
                            onChange={(e) => dispatch(setSelectedProduct(Number(e.target.value)))}
                            value={selectedProductId || ''}
                        >
                            <option value="" disabled>
                                -- בחר מוצר --
                            </option>
                            {selectedCategory.products.map((prod) => (
                                <option key={prod.id} value={prod.id}>
                                    {prod.name}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {selectedProduct && (
                    <>
                        <h2>הזן כמות</h2>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                        <button onClick={handleAddToCart}>הוסף לעגלה</button>
                    </>
                )}
            </div>

            {/* 👉 Right: Cart preview */}
            <div style={{ flex: 1 }}>
                <h2>🛒 עגלת קניות</h2>
                {cart.length === 0 ? (
                    <p>העגלה ריקה</p>
                ) : (
                    <ul>
                        {cart.map((item) => (
                            <li key={item.id}>
                                {item.name} — {item.quantity} יחידות
                            </li>
                        ))}
                    </ul>
                )}

                <div style={{ marginTop: '1rem' }}>
                    <button onClick={() => navigate('/cart')} disabled={cart.length === 0}>
                        המשך להזמנה
                    </button>
                </div>
            </div>
        </div>
    );
}
