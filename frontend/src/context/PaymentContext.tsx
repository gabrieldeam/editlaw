import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PaymentContextType {
  totalAmount: number;
  setTotalAmount: (total: number) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [totalAmount, setTotalAmount] = useState<number>(0);

  return (
    <PaymentContext.Provider value={{ totalAmount, setTotalAmount }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment deve ser usado dentro de um PaymentProvider");
  }
  return context;
};
