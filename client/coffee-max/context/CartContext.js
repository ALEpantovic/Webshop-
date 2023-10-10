import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);

  const onAdd = (product, quantity) => {
    const existingCartItem = cartItems.find(item => item.id === product.id);

    if (existingCartItem) {
      const updatedCartItems = cartItems.map(item => {
        if (item.id === product.id) {
          return {
            ...item,
            quantity: item.quantity + quantity
          };
        }
        return item;
      });

      setCartItems(updatedCartItems);
    } else {
      const newCartItem = {
        ...product,
        quantity
      };

      setCartItems([...cartItems, newCartItem]);
    }

    setTotalPrice(prevTotalPrice => prevTotalPrice + product.cena * quantity);
    setTotalQuantities(prevTotalQuantities => prevTotalQuantities + quantity);

    toast.success(`${quantity} ${product.Naziv} dodat u korpu.`);
  };

  const onRemove = (product) => {
    const productPrice = parseFloat(product.cena); // Convert to number
    const productQuantity = parseFloat(product.quantity); // Convert to number

    setTotalPrice(prevTotalPrice => prevTotalPrice - productPrice * productQuantity);
    setTotalQuantities(prevTotalQuantities => prevTotalQuantities - productQuantity);

    setCartItems(prevCartItems => prevCartItems.filter(item => item.id !== product.id));
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      totalPrice,
      totalQuantities,
      onAdd,
      onRemove
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
