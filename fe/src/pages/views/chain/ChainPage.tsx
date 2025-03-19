import { Fragment, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { ToolbarActions } from '@/layouts/demo1/toolbar';

import { KeenIcon } from '@/components';

import { ChainProvider } from '@/pages/views/chain/ChainContext.tsx';
import { ChainContent } from '@/pages/views/chain/ChainContent.tsx';
import { AddChainDialog } from '@/pages/views/chain/AddChainDialog.tsx';

const ChainPage = () => {
  const { currentLayout } = useLayout();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  return (
    <ChainProvider>
      <Fragment>
        {currentLayout?.name === 'demo1-layout' && (
          <Container>
            <Toolbar>
              <ToolbarHeading>
                <ToolbarPageTitle text={'Chains'} />
              </ToolbarHeading>
              <ToolbarActions>
                <button className="btn btn-sm btn-primary" onClick={() => handleOpenDialog()}>
                  <KeenIcon icon={'brifecase-tick'} />
                  New Chain
                </button>
              </ToolbarActions>
            </Toolbar>
          </Container>
        )}

        <Container>
          <ChainContent />
        </Container>
        <AddChainDialog onClose={handleCloseDialog} isOpen={isDialogOpen} />
      </Fragment>
    </ChainProvider>
  );
};

export { ChainPage };
