// Request interfaces
export interface IWalletRequest {
  address: string;
  nickname: string;
  chain: number;
  userId: number;
}

export interface IPayoutRequest {
  name: string;
  destination: string;
  frequency: string;
  amount: number;
  chain: number;
}

export interface ITrusdRequest {
  name: string;
  contractAddress: string
}

export interface IStablecoinRequest {
  name : string;
  fullName : string;
  contractAddress : string;
}

export interface ITest_trusdRequest {
  name : string;
  fullName : string;
  contractAddress : string;
}


export interface ITest_trusd {
  name : string;
  fullName : string;
  contractAddress : string;
}

// Response interfaces
export interface IWalletAddress {
  balances: { [key: string]: number };
  address: string;
  nickname: string;
  id: number;
  chain: {
    id: number;
    name: string;
  };
}

export interface ITrused {
  id: number;
  name : string;
  contractAddress : string;
  createdAt: string;
  updatedAt: string;
}

export interface IWalletTransaction {
  hash: string;
  stablecoin: {
    fullName: string;
    name: string;
  };
  timestamp: string;
  transactionId: number;
  value: number;
}

export interface IPayout {
  id: number;
  name: string;
  chain: {
    id: number;
    name: string;
    isActive: boolean;
  };
  destination: string;
  frequency: string;
  amount: number;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IStablecoin {
  id: number;
  name : string;
  fullName : string;
  contractAddress : string;
  createdAt: string;
  updatedAt: string;
}

export interface IChain {
  id: number;
  name: string;
  isActive: boolean;
}

export interface IChainRequest {
  name: string;
}
