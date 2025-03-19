import { Fragment, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { ToolbarActions } from '@/layouts/demo1/toolbar';

import { KeenIcon } from '@/components';
import { TrusdDialog } from './TrusdDialog';
import { Trusds } from './Trusds';

export const TrusdPage = () => {

    const { currentLayout } = useLayout();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);
    return (
        <>
            <Fragment>
                {currentLayout?.name === 'demo1-layout' && (
                    <Container>
                        <Toolbar>
                            <ToolbarHeading>
                                <ToolbarPageTitle text={'TRUSD'} />
                            </ToolbarHeading>
                            <ToolbarActions>
                                {/* <button className='btn btn-sm btn-primary' onClick={() => handleOpenDialog()} >
                                    <KeenIcon icon={'brifecase-tick'} />
                                    View Table
                                </button> */}
                            </ToolbarActions>
                        </Toolbar>
                    </Container>
                )}
                <Container>
                    <Trusds />
                </Container>
                <TrusdDialog onClose={handleCloseDialog} isOpen={isDialogOpen}></TrusdDialog>

            </Fragment>
        </>
    )
}