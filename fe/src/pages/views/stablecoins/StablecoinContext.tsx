import React, {createContext, useState, useEffect, useContext, ReactNode} from 'react'
import { IStablecoin } from '@/types/wallet.i'
import { getStablecoins } from '@/services/stablecoin.service';


interface StablecoinContextType {
  stablecoins: IStablecoin[];
  loading: boolean;
  fetchStablecoins: () => void;
}

const StablecoinContext = createContext<StablecoinContextType | undefined >(undefined);

export const StablecoinProvider: React.FC<{children: ReactNode }> = ({children}) => {
    const [Stablecoin, setStablecoin] = useState<IStablecoin[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchStablecoins = async () => {

        setLoading(true);
        try {
            const data = await getStablecoins();
            setStablecoin(data);
            setLoading(false);
        } catch (e) {
            console.error('Error fetching stablecoin...')
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <StablecoinContext.Provider value={{stablecoins: Stablecoin, fetchStablecoins, loading}}>
            {children}
        </StablecoinContext.Provider>
        </>
    )
}

export const useStablecoins = (): StablecoinContextType => {
      const context = useContext(StablecoinContext);
      if (!context) {
        throw new Error('useStablecoin must be used within an StablecoinProvider');
      }
      return context;
}