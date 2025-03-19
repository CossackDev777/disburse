import { Fragment, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { WalletContent } from '@/pages/views/wallets/WalletContent.tsx';
import { WalletProvider } from '@/pages/views/wallets/WalletContext.tsx';
import { ToolbarActions } from '@/layouts/demo1/toolbar';
import { KeenIcon } from '@/components';
import { TransactionProvider } from '@/pages/views/transactions/TransactionContext.tsx';
import { AddWalletDialog } from '@/pages/views/wallets/AddWalletDialog.tsx';

const WalletPage = () => {
  const { currentLayout } = useLayout();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  return (
    <TransactionProvider>
      <WalletProvider>
        <Fragment>
          {currentLayout?.name === 'demo1-layout' && (
            <Container>
              <Toolbar>
                <ToolbarHeading>
                  <ToolbarPageTitle text={'Transactions Addresses'} />
                </ToolbarHeading>
                <ToolbarActions>
                  <button className="btn btn-sm btn-primary" onClick={() => handleOpenDialog()}>
                    <KeenIcon icon={'brifecase-tick'} />
                    New Account
                  </button>
                </ToolbarActions>
              </Toolbar>
            </Container>
          )}

          <Container>
            <WalletContent />
          </Container>
        </Fragment>
        <AddWalletDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
      </WalletProvider>
    </TransactionProvider>
  );
};

export { WalletPage };
