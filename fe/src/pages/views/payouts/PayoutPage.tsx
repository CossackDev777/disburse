import { Fragment, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { ToolbarActions } from '@/layouts/demo1/toolbar';

import { KeenIcon } from '@/components';

import { PayoutProvider } from '@/pages/views/payouts/PayoutContext.tsx';
import { PayoutContent } from '@/pages/views/payouts/PayoutContent.tsx';
import { AddPayoutDialog } from '@/pages/views/payouts/AddPayoutDialog.tsx';
import { WalletProvider } from '@/pages/views/wallets/WalletContext.tsx';

const PayoutPage = () => {
  const { currentLayout } = useLayout();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  return (
    <WalletProvider>
      <PayoutProvider>
        <Fragment>
          {currentLayout?.name === 'demo1-layout' && (
            <Container>
              <Toolbar>
                <ToolbarHeading>
                  <ToolbarPageTitle text={'Payouts'} />
                </ToolbarHeading>
                <ToolbarActions>
                  <button className="btn btn-sm btn-primary" onClick={() => handleOpenDialog()}>
                    <KeenIcon icon={'brifecase-tick'} />
                    New Payout
                  </button>
                </ToolbarActions>
              </Toolbar>
            </Container>
          )}

          <Container>
            <PayoutContent />
          </Container>
          <AddPayoutDialog onClose={handleCloseDialog} isOpen={isDialogOpen} />
        </Fragment>
      </PayoutProvider>
    </WalletProvider>
  );
};

export { PayoutPage };
