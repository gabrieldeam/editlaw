import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface CartContextType {
  cartItems: string[];
  addToCart: (itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  setCartItems: (items: string[]) => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItemsState] = useState<string[]>([]);

  useEffect(() => {
    // Carrega os itens do carrinho do localStorage ao montar o contexto
    const storedCartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    if (Array.isArray(storedCartItems)) {
      setCartItemsState(storedCartItems);
    }
  }, []);

  useEffect(() => {
    // Atualiza o localStorage sempre que cartItems mudar
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (itemId: string) => {
    setCartItemsState((prevItems) => [...prevItems, itemId]);
  };

  const removeFromCart = (itemId: string) => {
    setCartItemsState((prevItems) => prevItems.filter((id) => id !== itemId));
  };

  const clearCart = () => {
    setCartItemsState([]);
    localStorage.removeItem('cart'); // Limpa o localStorage quando o carrinho é esvaziado
  };

  const setCartItems = (items: string[]) => {
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
