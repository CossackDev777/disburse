import React, { useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@/components/modal';
import { KeenIcon } from '@/components';
import { useWallets } from '@/pages/views/wallets/WalletContext.tsx';
import { addPayout } from '@/services/wallet.service.ts';
import { IPayoutRequest } from '@/types/wallet.i.ts';
import { usePayouts } from '@/pages/views/payouts/PayoutContext.tsx';

const FrequencyOptions = ['Daily', 'Weekly', 'Monthly'];

interface AddPayoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPayoutDialog: React.FC<AddPayoutDialogProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<IPayoutRequest>({
    name: '',
    destination: '',
    amount: 0,
    frequency: '',
    chain: 0
  });

  const { fetchPayouts } = usePayouts();
  const { chains } = useWallets();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const is_sent = await addPayout(formData);
    if (is_sent) {
      fetchPayouts();
      onClose();
      setFormData({
        name: '',
        destination: '',
        amount: 0,
        frequency: '',
        chain: 0
      });
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} className="flex items-center justify-center">
      <ModalContent
        className="container-fixed px-6 sm:px-10 md:px-20 overflow-hidden pt-7.5 my-[10%]
               w-[95%] max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl dark:border-gray-50/20 dark:border"
      >
        <ModalHeader className="p-0 border-0">
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5 pt-7.5">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-xl font-semibold leading-none flex flex-row text-gray-900 items-center gap-2">
                <KeenIcon icon={'brifecase-tick'} />
                <p>Add New Payout</p>
              </h1>
              <div className="flex items-center gap-2 text-sm font-normal text-gray-700">
                Add a new payout to your wallet.
              </div>
            </div>
          </div>
        </ModalHeader>
        <ModalBody className="py-0 mb-5 ps-0 pe-3 -me-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input input-sm w-full"
                placeholder="Enter name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Destination</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                className="input input-sm w-full"
                placeholder="Enter payout destination"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Frequency</label>
              <select
                name="frequency"
                className="select select-sm w-full"
                value={formData?.frequency}
                required
                onChange={(e) => handleSelectChange('frequency', e.target.value)}
              >
                <option disabled value="">
                  Select Frequency
                </option>
                {FrequencyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Chain</label>
              <select
                name="chain"
                className="select select-sm w-full"
                value={formData?.chain}
                required
                onChange={(e) => handleSelectChange('chain', e.target.value)}
              >
                <option disabled value="">
                  Select Chain
                </option>
                {chains?.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="input input-sm w-full"
                placeholder="Enter payout amount"
                required
              />
            </div>

            <div className="flex justify-end gap-3 ">
              <button type="button" className="btn btn-sm btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-sm btn-primary">
                <KeenIcon icon={'brifecase-tick'} />
                Add Payout
              </button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
