import { Transactions } from '@/pages/views/transactions/transaction-table/Transactions.tsx';

import { useLocation } from 'react-router-dom';

const TransactionContent = () => {
  const location = useLocation();
  const stateData = location.state;
  console.log(stateData);

  return (
    <div>
      <p className={'badge mb-2'}>
        Transactions for <strong className={'mx-1'}> {stateData?.nickname}</strong>/{' '}
        {stateData.address}
      </p>
      <div className="grid gap-5 lg:gap-7.5">
        <Transactions selectedWallet={stateData} />
      </div>
    </div>
  );
};

export { TransactionContent };
