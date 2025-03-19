import React, { createContext, useState, useContext, ReactNode } from 'react';
import { IChain } from '@/types/wallet.i.ts';
import { getAllChains, getChains } from '@/services/wallet.service.ts';

interface ChainContextType {
  Chains: IChain[];
  loading: boolean;
  fetchChains: () => void;
}

const ChainContext = createContext<ChainContextType | undefined>(undefined);

export const ChainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [Chain, setChain] = useState<IChain[]>([]);
  const [loading, setLoading] = useState(false);

  // const spaceId = getAuth()?.user.spaceId;

  const fetchChains = async () => {
    setLoading(true);
    try {
      const data = await getChains();

      setChain(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Chains...');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChainContext.Provider value={{ Chains: Chain, fetchChains, loading }}>
      {children}
    </ChainContext.Provider>
  );
};

// Custom hook to use the ChainContext
export const useChains = (): ChainContextType => {
  const context = useContext(ChainContext);
  if (!context) {
    throw new Error('useChains must be used within an ChainProvider');
  }
  return context;
};
