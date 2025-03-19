import { useEffect, useState } from 'react';
import { showToast } from '@/utils/toast_helper.ts';

export const MetaAccountConnector = () => {
  const [connectedAccount, setConnectedAccount] = useState<string | null>(
    localStorage.getItem('connectedAccount') || null
  );

  // Connect to MetaMask
  const connectMetamask = async () => {
    if (!window.ethereum) {
      showToast('error', 'Metamask not found. Please install Metamask.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      if (accounts && accounts.length > 0) {
        setConnectedAccount(accounts[0]);
        localStorage.setItem('connectedAccount', accounts[0]); // Save for persistence
      } else {
        showToast('error', 'No accounts found. Please connect Metamask.');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to connect Metamask.');
    }
  };

  // Shorten Ethereum address for display
  const shortenAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Disconnect MetaMask
  const disconnectMetamask = () => {
    setConnectedAccount(null);
    localStorage.removeItem('connectedAccount'); // Clear stored account
  };

  // Listen for account and network changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setConnectedAccount(accounts[0]);
          localStorage.setItem('connectedAccount', accounts[0]); // Update stored account
        } else {
          disconnectMetamask();
        }
      };

      const handleChainChanged = () => {
        window.location.reload(); // Reload to sync state
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  // Auto-reconnect on page refresh
  useEffect(() => {
    if (localStorage.getItem('connectedAccount')) {
      connectMetamask();
    }
  }, []);

  return (
    <div className="p-4">
      {connectedAccount ? (
        <div className="flex items-center space-x-3">
          <span className="text-gray-800 font-medium">{shortenAddress(connectedAccount)}</span>
          <button onClick={disconnectMetamask} className="btn btn-danger btn-sm">
            Disconnect
          </button>
        </div>
      ) : (
        <button onClick={connectMetamask} className="btn btn-primary btn-sm">
          Connect MetaMask
        </button>
      )}
    </div>
  );
};