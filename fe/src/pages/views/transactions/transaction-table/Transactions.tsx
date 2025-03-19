import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid, KeenIcon } from '@/components';
import { ColumnDef } from '@tanstack/react-table';

import { IWalletAddress, IWalletTransaction } from '@/types/wallet.i.ts';
import { useTransactions } from '@/pages/views/transactions/TransactionContext.tsx';
import { formatDateTime } from '@/utils/Date.ts';

const Transactions = ({ selectedWallet }: { selectedWallet: IWalletAddress }) => {
  const [filter, setFilter] = useState<string>('');
  const { handleAddressChange } = useTransactions();

  const [filterData, setFilterData] = useState<IWalletTransaction[]>([]);

  const { loading, transactions } = useTransactions();

  useEffect(() => {
    handleAddressChange(selectedWallet?.id);
  }, [handleAddressChange, selectedWallet]);

  // Filter logic
  useEffect(() => {
    if (filter.length) {
      setFilterData(
        transactions.filter((wallet) => wallet.hash.toLowerCase().includes(filter.toLowerCase()))
      );
    } else {
      setFilterData(transactions);
    }
  }, [filter, transactions]);

  const columns = useMemo<ColumnDef<IWalletTransaction>[]>(
    () => [
      {
        accessorFn: (row) => row.stablecoin.name,
        id: 'name',
        header: () => 'Stable Coin',
        enableSorting: true,
        cell: (info) => <div className={'text-xs'}>{info.getValue() as string}</div>,
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.value,
        id: 'value',
        header: () => 'Value',
        enableSorting: true,
        cell: (info) => <div className={'text-xs'}>{info.getValue() as string}</div>,
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.hash,
        id: 'hash',
        header: () => 'Hash',
        enableSorting: true,
        cell: (info) => <div className={'badge'}>{info.getValue() as string}</div>,
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.timestamp,
        id: 'timestamp',
        header: () => 'Timestamp',
        enableSorting: true,
        cell: (info) => (
          <div className={'text-xs'}>{formatDateTime(info.getValue() as string)}</div>
        ),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
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
                placeholder="Search Transactions by Hash"
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
          sorting={[{ id: 'hash', desc: true }]}
        />
      </div>
    </div>
  );
};

export { Transactions };
