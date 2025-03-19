import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid, KeenIcon } from '@/components';
import { ColumnDef } from '@tanstack/react-table';

import { IChain } from '@/types/wallet.i.ts';
import { useChains } from '@/pages/views/chain/ChainContext.tsx';
import { archiveChain } from '@/services/wallet.service.ts';

const Chains = () => {
  const [filter, setFilter] = useState<string>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [filterData, setFilterData] = useState<IChain[]>([]);
  const [selectedChain, setSelectedChain] = useState<IChain | null>(null);

  const { fetchChains, loading, Chains } = useChains();

  // Methods for Delete Event Dialog
  const handleOpenDeleteDialog = (Chain: IChain) => {
    setSelectedChain(Chain);
    setIsDeleteDialogOpen(true);
  };
  const handleCloseDeleteDialog = () => setIsDeleteDialogOpen(false);

  const handleChainDelete = async () => {
    const is_deleted = await archiveChain(selectedChain?.id as number);
    if (is_deleted) {
      fetchChains();
    }
  };

  useEffect(() => {
    fetchChains();
  }, []);

  // Filter logic
  useEffect(() => {
    if (filter.length) {
      setFilterData(
        Chains.filter((Chain) => Chain.name.toLowerCase().includes(filter.toLowerCase()))
      );
    } else {
      setFilterData(Chains);
    }
  }, [filter, Chains]);

  const columns = useMemo<ColumnDef<IChain>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        id: 'name',
        header: () => 'Name',
        enableSorting: true,
        cell: (info) => <div className={'text-xs'}>{info.getValue() as string}</div>,
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      /*      {
        accessorFn: (row) => row.isActive,
        id: 'isActive',
        header: () => 'Is Active',
        enableSorting: true,
        cell: (info) =>
          info.getValue() ? (
            <div className={'badge-success'}>ACTIVE</div>
          ) : (
            <div className={'badge-danger'}>INACTIVE</div>
          ),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },*/

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

      <div className="card-body">
        <DataGrid
          loading={loading}
          data={filterData}
          columns={columns}
          rowSelect={false}
          pagination={{ size: 5 }}
          sorting={[{ id: 'name', desc: true }]}
        />
      </div>
      <DeleteChain
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleChainDelete}
      />
    </div>
  );
};

export { Chains };

const DeleteChain: React.FC<{
  isOpen: boolean;
  onDelete: () => void;
  onClose: () => void;
}> = ({ isOpen, onDelete, onClose }) => {
  if (!isOpen) return null;

  return (
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
                <p>Remove Chain</p>
              </div>
              <p className={'text-sm font-normal text-gray-800 -mt-1'}>
                Are you sure you want to remove this Chain?
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
            Remove Chain
          </button>
        </div>
      </div>
    </div>
  );
};
