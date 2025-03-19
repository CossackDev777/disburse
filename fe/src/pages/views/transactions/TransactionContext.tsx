import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getTransactions } from '@/services/wallet.service.ts';
import { IWalletTransaction } from '@/types/wallet.i.ts';

interface TransactionContextType {
  transactions: IWalletTransaction[];
  loading: boolean;
  handleAddressChange: (address: number) => void;
  selectedAddress: number | null;
  fetchTransactions: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<IWalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);

  // Update selectedAddress and trigger fetch when it changes
  const handleAddressChange = (address: number) => {
    setSelectedAddress(address);
  };

  const fetchTransactions = async () => {
    if (selectedAddress === null) return;

    setLoading(true);
    try {
      console.log('Fetching transactions for address:', selectedAddress);
      const data = await getTransactions(selectedAddress);
      console.log('Fetched transactions:', data);

      setTransactions(data || []);
    } catch (error) {
      console.error(`Error fetching transactions for address ${selectedAddress}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch transactions when selectedAddress changes
  useEffect(() => {
    fetchTransactions();
  }, [selectedAddress]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        fetchTransactions,
        loading,
        handleAddressChange,
        selectedAddress
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook to use the TransactionContext
export const useTransactions = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
