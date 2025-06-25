import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
    const cart = useSelector((state) => state.categories.cart);
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!firstName.trim()) newErrors.firstName = 'שדה חובה';
        if (!address.trim()) newErrors.address = 'שדה חובה';
        if (!email.trim()) newErrors.email = 'שדה חובה';
        else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) newErrors.email = 'כתובת מייל לא תקינה';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitOrder = async () => {
        if (!validate()) return;

        const orderData = {
            customer: {
                name: firstName,
                address,
                email,
            },
            cart,
        };

        try {
            const response = await fetch(
                'https://tjdavpjfkbpgrbdhxunjpx7ita0tqcit.lambda-url.eu-central-1.on.aws/save',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                }
            );

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const result = await response.json(); // אם הלמבדא מחזירה JSON
            console.log('✅ Order sent successfully:', result);
            alert('ההזמנה נשלחה בהצלחה!');
        } catch (error) {
            console.error('❌ Failed to send order:', error);
            alert('שגיאה בשליחת ההזמנה. נסה שוב מאוחר יותר.');
        }
    };


    return (
        <div className="container" style={{ padding: '2rem' }}>
            <h1>עגלת קניות</h1>
            {cart.length === 0 ? (
                <p>אין מוצרים בעגלה</p>
            ) : (
                <ul>
                    {cart.map((item) => (
                        <li key={item.id}>
                            {item.name} — {item.quantity} יחידות
                        </li>
                    ))}
                </ul>
            )}

            <h2>פרטי משתמש</h2>

            <label>
                שם פרטי ומשפחה: <span style={{ color: 'red' }}>*</span>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{ borderColor: errors.firstName ? 'red' : undefined }}
                />
                {errors.firstName && <div style={{ color: 'red' }}>{errors.firstName}</div>}
            </label>

            <br />

            <label>
                כתובת מלאה: <span style={{ color: 'red' }}>*</span>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ borderColor: errors.address ? 'red' : undefined }}
                />
                {errors.address && <div style={{ color: 'red' }}>{errors.address}</div>}
            </label>

            <br />

            <label>
                מייל: <span style={{ color: 'red' }}>*</span>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ borderColor: errors.email ? 'red' : undefined }}
                />
                {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
            </label>

            <br />
            <div style={{ display: 'flex', gap: '2rem' }}>
                <button onClick={handleSubmitOrder} disabled={cart.length === 0}>
                    אשר הזמנה
                </button>

                <button onClick={() => navigate('/')} style={{ marginRight: '1rem' }}>
                    חזרה לבחירת מוצרים
                </button>
            </div>
        </div>
    );
}
