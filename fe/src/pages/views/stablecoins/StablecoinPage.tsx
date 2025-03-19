import { Fragment, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { ToolbarActions } from '@/layouts/demo1/toolbar';

import { KeenIcon } from '@/components';

import { StablecoinContent } from './StablecoinContent.tsx';
import { StablecoinProvider } from './StablecoinContext.tsx';
import { AddStablecoinDialog } from './AddStablecoinDialog.tsx';

const StablecoinPage = () => {
    const { currentLayout } = useLayout();

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);

    return (
        <>
            <StablecoinProvider>
                <Fragment>
                    {currentLayout?.name === 'demo1-layout' && (
                        <Container>
                            <Toolbar>
                                <ToolbarHeading>
                                    <ToolbarPageTitle text={'Stablecoins'} />
                                </ToolbarHeading>
                                <ToolbarActions>
                                    <button className='btn btn-sm btn-primary' onClick={() => handleOpenDialog()} >
                                        <KeenIcon icon={'brifecase-tick'} />
                                        New Stablecoin
                                    </button>
                                </ToolbarActions>
                            </Toolbar>
                        </Container>
                    )}
                    <Container>
                        <StablecoinContent />
                    </Container>
                    <AddStablecoinDialog onClose = {handleCloseDialog} isOpen={isDialogOpen}></AddStablecoinDialog>
                </Fragment>
            </StablecoinProvider>
        </>
    );
};

export { StablecoinPage };