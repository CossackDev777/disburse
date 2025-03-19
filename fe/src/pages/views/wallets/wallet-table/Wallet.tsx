import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid, KeenIcon } from '@/components';
import { ColumnDef } from '@tanstack/react-table';

import { useWallets } from '@/pages/views/wallets/WalletContext.tsx';
import { IWalletAddress } from '@/types/wallet.i.ts';
import { useNavigate } from 'react-router';
import { useTransactions } from '@/pages/views/transactions/TransactionContext.tsx';

const Wallet = () => {
  const [filter, setFilter] = useState<string>('');

  const [filterData, setFilterData] = useState<IWalletAddress[]>([]);

  const { fetchWallets, loading, wallets } = useWallets();
  const navigate = useNavigate();
  const { handleAddressChange } = useTransactions();

  // This method fetches the organization data from the backend at start
  useEffect(() => {
    fetchWallets();

    const currencies = new Set<string>();
    wallets.forEach((wallet) => {
      Object.keys(wallet.balances).forEach((currency) => {
        currencies.add(currency);
      });
    });
  }, []);

  const handleTransactionClick = (selectedWallet: IWalletAddress) => {
    handleAddressChange(selectedWallet.id);

    navigate(`/wallets/transactions/${selectedWallet.id}`, { state: selectedWallet });
  };

  // Filter logic
  useEffect(() => {
    if (filter.length) {
      setFilterData(
        wallets.filter((wallet) => wallet.address.toLowerCase().includes(filter.toLowerCase()))
      );
    } else {
      setFilterData(wallets);
    }
  }, [filter, wallets]);

  //Extract unique currency keys
  const balanceKeys = Array.from(new Set(wallets.flatMap((data) => Object.keys(data.balances))));

  const columns = useMemo<ColumnDef<IWalletAddress>[]>(
    () => [
      {
        accessorFn: (row) => row.address,
        id: 'address',
        header: () => 'Address',
        enableSorting: true,
        cell: (info) => (
          <div
            onClick={() => handleTransactionClick(info.row.original)}
            className={
              'badge hover:badge-primary cursor-pointer badge-outline dark:hover:text-white'
            }
          >
            {info.getValue() as string}
          </div>
        ),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.nickname,
        id: 'nickname',
        header: () => 'Nickname',
        enableSorting: true,
        cell: (info) => <div className={'text-xs'}>{info.getValue() as string}</div>,
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.chain?.name,
        id: 'chain',
        header: () => 'Chain',
        enableSorting: true,
        cell: (info) => <div className={'text-xs'}>{info.getValue() as string}</div>,
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      // Dynamically create columns for each currency
      ...balanceKeys.map((key) => ({
        accessorFn: (row: { balances: { [x: string]: any } }) => row.balances[key] || 0,
        id: key,
        header: () => key, // Set the column header as the currency name
        enableSorting: false,
        cell: (info: { getValue: () => any }) => info.getValue(),
        meta: {
          className: 'min-w-[100px]',
          cellClassName: 'text-gray-800 text-right text-xs'
        }
      }))

      // {
      //   id: 'menu',
      //   header: () => '',
      //   enableSorting: false,
      //   cell: ({ row }) => (
      //     <>
      //       <Menu className=" rounded-md mt-2 p-2">
      //         <MenuItem
      //           toggle="dropdown"
      //           trigger="hover"
      //           dropdownProps={{
      //             placement: isRTL() ? 'left-start' : 'right-start',
      //             modifiers: [
      //               {
      //                 name: 'offset',
      //                 options: {
      //                   offset: isRTL() ? [50, 0] : [-50, 0] // [skid, distance]
      //                 }
      //               }
      //             ]
      //           }}
      //         >
      //           <MenuLink>
      //             <KeenIcon icon="dots-square-vertical" />
      //           </MenuLink>
      //           <MenuSub className="menu-default light:border-gray-300 w-[200px] md:w-[220px]">
      //             <MenuItem onClick={() => handleOrganizationUpdate(row.original)}>
      //               <MenuLink>
      //                 <MenuIcon>
      //                   <KeenIcon icon="pencil" />
      //                 </MenuIcon>
      //                 <MenuTitle>Edit Transactions</MenuTitle>
      //               </MenuLink>
      //             </MenuItem>
      //
      //             <MenuSeparator />
      //             <MenuItem onClick={() => handleOpenDeleteDialog(row.original)}>
      //               <MenuLink>
      //                 <MenuIcon>
      //                   <KeenIcon icon="trash" />
      //                 </MenuIcon>
      //                 <MenuTitle>Remove Transactions</MenuTitle>
      //               </MenuLink>
      //             </MenuItem>
      //           </MenuSub>
      //         </MenuItem>
      //       </Menu>
      //     </>
      //   ),
      //   meta: {
      //     className: 'w-[60px]'
      //   }
      // }
    ],
    [balanceKeys]
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
                placeholder="Search Transactions Address"
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
          sorting={[{ id: 'address', desc: true }]}
        />
      </div>
    </div>
  );
};

export { Wallet };
