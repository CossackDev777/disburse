import { Fragment, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { ToolbarActions } from '@/layouts/demo1/toolbar';

import {
  TransactionProvider,
  useTransactions
} from '@/pages/views/transactions/TransactionContext.tsx';
import { TransactionContent } from '@/pages/views/transactions/TransactionContent.tsx';
import { KeenIcon } from '@/components';
import { useNavigate } from 'react-router';

const TransactionPage = () => {
  return (
    <TransactionProvider>
      <TransactionPageContent />
    </TransactionProvider>
  );
};

const TransactionPageContent = () => {
  const { currentLayout } = useLayout();
  const { fetchTransactions, loading } = useTransactions();
  const navigate = useNavigate();

  const handleRefresh = () => {
    fetchTransactions(); // Refresh transactions
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text={'Transactions'} />
            </ToolbarHeading>
            <ToolbarActions>
              <button className="btn btn-sm btn-secondary" onClick={handleBack}>
                Back
              </button>
              <button className="btn btn-sm btn-primary" onClick={handleRefresh}>
                <KeenIcon icon="arrows-circle" />
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}
      <Container>
        <TransactionContent />
      </Container>
    </Fragment>
  );
};

export { TransactionPage };
