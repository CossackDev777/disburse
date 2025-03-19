import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { getChains, getWalletAddress } from '@/services/wallet.service.ts';
import { IChain, IWalletAddress } from '@/types/wallet.i.ts';
import { useAuth } from '@/auth/providers/JWTProvider.tsx';

interface WalletContextType {
  wallets: IWalletAddress[];
  chains: IChain[];
  loading: boolean;
  fetchWallets: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<IWalletAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [chains, setChain] = useState<IChain[]>([]);
  const currentUser = useAuth().auth?.user;

  const fetchChainOptions = async () => {
    return await getChains();
  };

  useEffect(() => {
    fetchChainOptions().then((chainOptions) => {
      setChain(chainOptions);
    });
  }, []);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      if (!currentUser) return;
      const data = await getWalletAddress(currentUser?.id as number);

      const processedWallets = data.map((wallet) => ({
        id: wallet.id,
        address: wallet.address,
        nickname: wallet.nickname,
        balances: wallet.balances,
        chain: wallet.chain
      }));
      setWallet(processedWallets);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wallet...');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WalletContext.Provider value={{ wallets: wallet, fetchWallets, loading, chains }}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the WalletContext
export const useWallets = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallets must be used within an WalletProvider');
  }
  return context;
};
