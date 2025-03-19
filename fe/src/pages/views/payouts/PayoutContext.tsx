import React, { createContext, useState, useContext, ReactNode } from 'react';
import { IPayout } from '@/types/wallet.i.ts';
import { getPayouts } from '@/services/wallet.service.ts';

interface PayoutContextType {
  payouts: IPayout[];
  loading: boolean;
  fetchPayouts: () => void;
}

const PayoutContext = createContext<PayoutContextType | undefined>(undefined);

export const PayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [Payout, setPayout] = useState<IPayout[]>([]);
  const [loading, setLoading] = useState(false);

  // const spaceId = getAuth()?.user.spaceId;

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const data = await getPayouts();

      setPayout(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Chains...');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PayoutContext.Provider value={{ payouts: Payout, fetchPayouts, loading }}>
      {children}
    </PayoutContext.Provider>
  );
};

// Custom hook to use the PayoutContext
export const usePayouts = (): PayoutContextType => {
  const context = useContext(PayoutContext);
  if (!context) {
    throw new Error('usePayouts must be used within an PayoutProvider');
  }
  return context;
};
