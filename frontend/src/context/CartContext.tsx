// src/context/CartContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface CartItem {
  type: 'document' | 'package';
  id: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  clearCart: () => void;
  setCartItems: (items: CartItem[]) => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItemsState] = useState<CartItem[]>([]);

  // Carregar itens do carrinho do localStorage ao montar o componente
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // Verifica se os dados do carrinho são válidos
        if (Array.isArray(parsedCart)) {
          setCartItemsState(parsedCart as CartItem[]);
        }
      } catch (e) {
        console.error('Erro ao carregar o carrinho do localStorage:', e);
        setCartItemsState([]);
      }
    }
  }, []);

  // Atualizar o localStorage sempre que o estado do carrinho mudar
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cart'); // Limpa o carrinho no localStorage se estiver vazio
    }
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItemsState((prevItems) => [...prevItems, item]);
  };

  const removeFromCart = (item: CartItem) => {
    setCartItemsState((prevItems) =>
      prevItems.filter(
        (cartItem) => !(cartItem.type === item.type && cartItem.id === item.id)
      )
    );
  };

  const clearCart = () => {
    setCartItemsState([]);
    localStorage.removeItem('cart');
  };

  const setCartItems = (items: CartItem[]) => {
    setCartItemsState(items);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, setCartItems, cartCount: cartItems.length }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
