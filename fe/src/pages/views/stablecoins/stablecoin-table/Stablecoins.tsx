import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid, KeenIcon } from '@/components';
import { ColumnDef } from '@tanstack/react-table';

import { IStablecoin } from '@/types/wallet.i';
import { ClassNames } from '@emotion/react';
import { useStablecoins } from '@/pages/views/stablecoins/StablecoinContext.tsx';
import { deleteStablecoin } from '@/services/stablecoin.service.ts'

const Stablecoins = () => { 

    const [filter, setFilter] = useState<string>('');
    const [filterData, setFilterData] = useState<IStablecoin[]>([]);
    const { fetchStablecoins, loading, stablecoins } = useStablecoins();


    const [selectedStablecoin, setSelectedStablecoin] = useState<IStablecoin | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
   
    const handleOpenDeleteDialog = (stablecoin: IStablecoin) => {
        setSelectedStablecoin(stablecoin);
        setIsDeleteDialogOpen(true);
    }
    const handleCloseDeleteDialog = () => setIsDeleteDialogOpen(false);
    
    const handleStablecoinDelete = async () => {
        const is_deleted = await deleteStablecoin(selectedStablecoin?.id as number);
        if (is_deleted) {
            fetchStablecoins();
        }
    };

    useEffect(() => {
        fetchStablecoins();
    }, []);

    useEffect(() => {
        if (filter.length) {
            setFilterData(
                stablecoins.filter((stablecoin) => stablecoin.name.toLowerCase().includes(filter.toLowerCase()))
            );
        } else {
            setFilterData(stablecoins);
        }
    }, [filter, stablecoins]);


    const columns = useMemo<ColumnDef<IStablecoin>[]>(

        () => [
            {
                accessorFn: (row) => row.name,
                id: 'name',
                header: () => 'Name',
                enableSorting: true,
                cell: (info) => <div className={'text-xs'}>{info.getValue() as String}</div>,
                meta: {
                    className: 'min-w-[300px]',
                    cellClassName: 'text-gray-800 font-normal'
                }
            }, {
                accessorFn: (row) => row.fullName,
                id: 'full_name',
                header: () => 'Full_name',
                enableSorting: true,
                cell: (info) => <div className={'text-xs'}>{info.getValue() as String}</div>,
                meta: {
                    className: 'min-w-[200px]',
                    cellClassName: 'text-gray-800 font-normal'
                }
            },
            {
                accessorFn: (row) => row.contractAddress,
                id: 'contractAddress',
                header: () => 'Contract_address',
                enableSorting: true,
                cell: (info) => <div className={'text-xs'}>{info.getValue() as String}</div>,
                meta: {
                    className: 'min-w-[300px]',
                    cellClassName: 'text-gray-800 font-normal'
                }
            },
            {
                id: 'Action',
                header: () => '',
                enableSorting: false,
                cell: ({ row }) => (
                    <div onClick={() => handleOpenDeleteDialog(row.original)}>
                        <button className={'btn-icon btn-xs'}>
                            <KeenIcon icon={'trash'} />
                        </button>
                    </div>
                ),
                meta: {
                    className: 'w-[60px]'
                }
            }
        ],
        []
    );

    return (
        <>
            <div className="card card-grid min-w-full">
                <div className="card-header flex-wrap gap-2">
                    <h3 className="card-title font-medium text-sm">{''}</h3>

                    <div className="flex flex-wrap gap-2 lg:gap-5">
                        <div className="flex">
                            <label className="input input-sm">
                                <KeenIcon icon="magnifier" />
                                <input
                                    placeholder="Search By Name"
                                    type="text"
                                    value={filter}
                                    onChange={(event) => {
                                        setFilter(event.target.value);
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <div className='card-body'>
                    <DataGrid
                        // loading={loading}
                        data={filterData}
                        columns={columns}
                        rowSelect={false}
                        pagination={{ size: 5 }}
                        sorting={[{ id: 'name', desc: true }]}
                    />
                </div>
                <DeleteStablecoin
                    isOpen={isDeleteDialogOpen}
                    onClose={handleCloseDeleteDialog}
                    onDelete={handleStablecoinDelete}
                />
            </div>
        </>
    )
}

export { Stablecoins }

const DeleteStablecoin: React.FC<{
    isOpen: boolean;
    onDelete: () => void;
    onClose: () => void;
}> = ({ isOpen, onDelete, onClose }) => {
    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
                style={{ animation: 'fadeIn 0.3s ease' }}
                onClick={onClose}
            >
                <div
                    className="dark:bg-neutral-950 dark:border-gray-50/15 dark:border bg-white rounded-lg p-6 w-full sm:w-96 md:w-1/2 lg:w-1/3 shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800  items-center gap-2">
                            <div className={'flex flex-col gap-2'}>
                                <div className={'flex flex-row items-center gap-2 justify-start '}>
                                    <KeenIcon icon={'trash'} />
                                    <p>Remove Stablecoin</p>
                                </div>
                                <p className={'text-sm font-normal text-gray-800 -mt-1'}>
                                    Are you sure you want to remove this Stablecoin?
                                </p>
                            </div>
                        </h3>
                    </div>

                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={onClose}
                            className="btn btn-secondary text-gray-600  w-1/2 justify-center"
                        >
                            <KeenIcon icon={'cross'} />
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onDelete();
                                onClose();
                            }}
                            className="btn  btn-danger text-white w-1/2 items-center justify-center"
                        >
                            <KeenIcon icon={'trash'} />
                            Remove Stablecoin
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}