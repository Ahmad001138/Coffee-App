import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            // Create a unique key based on ID and size
            const productKey = `${product.id}-${product.selectedSize || 'M'}`;

            const existingItemIndex = prevItems.findIndex(
                (item) => `${item.id}-${item.selectedSize || 'M'}` === productKey
            );

            if (existingItemIndex >= 0) {
                // Item exists, update quantity
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + (product.quantity || 1),
                };
                return updatedItems;
            } else {
                // New item
                return [...prevItems, { ...product, quantity: product.quantity || 1 }];
            }
        });
    };

    const removeFromCart = (productId, selectedSize) => {
        setCartItems((prevItems) =>
            prevItems.filter(
                (item) => item.id !== productId || item.selectedSize !== selectedSize
            )
        );
    };

    const incrementQuantity = (productId, selectedSize) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === productId && item.selectedSize === selectedSize) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            })
        );
    };

    const decrementQuantity = (productId, selectedSize) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === productId && item.selectedSize === selectedSize) {
                    const newQuantity = Math.max(1, item.quantity - 1);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = useMemo(() => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
            return total + price * item.quantity;
        }, 0);
    }, [cartItems]);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        cartTotal,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
