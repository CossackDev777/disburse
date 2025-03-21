import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@/components/modal';
import { KeenIcon } from '@/components';
import { useWallets } from '@/pages/views/wallets/WalletContext.tsx';
import { addWallet } from '@/services/wallet.service.ts';
import { IWalletRequest } from '@/types/wallet.i.ts';
import { useAuth } from '@/auth/providers/JWTProvider.tsx';

interface AddWalletDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddWalletDialog: React.FC<AddWalletDialogProps> = ({ isOpen, onClose }) => {
  const currentUser = useAuth().auth?.user;
  const { fetchWallets, chains } = useWallets();

  // Initialize chain as undefined (or null) to avoid invalid 0 value
  const [formData, setFormData] = useState<IWalletRequest>({
    address: '',
    nickname: '',
    chain: undefined as unknown as number,
    userId: currentUser?.id || 0
  });

  // Update userId when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({ ...prev, userId: currentUser.id }));
    }
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    // Convert chain value to number
    const parsedValue = name === 'chain' ? parseInt(value, 10) : value;
    setFormData((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.chain || !currentUser) return;
    console.log('formData:', formData);

    const is_sent = await addWallet({
      ...formData,
      userId: currentUser.id // Ensure fresh user ID
    });

    if (is_sent) {
      fetchWallets();
      onClose();
      // Reset form with proper initial values
      setFormData({
        address: '',
        nickname: '',
        chain: undefined as unknown as number,
        userId: currentUser.id
      });
    }
  };

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({ ...prev, userId: currentUser.id }));
    }
  }, [currentUser]);

  return (
    <Modal open={isOpen} onClose={onClose} className="flex items-center justify-center">
      <ModalContent
        className="container-fixed px-6 sm:px-10 md:px-20 overflow-hidden pt-7.5 my-[10%]
               w-[95%] max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl dark:border-gray-50/20 dark:border"
      >
        {/* Modal Header */}
        <ModalHeader className="p-0 border-0">
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5 pt-7.5">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-xl font-semibold leading-none flex flex-row text-gray-900 items-center gap-2">
                <KeenIcon icon={'brifecase-tick'} />
                <p>Add Account</p>
              </h1>
              <div className="flex items-center gap-2 text-sm font-normal text-gray-700">
                Create and manage your wallets effortlessly.
              </div>
            </div>
          </div>
        </ModalHeader>

        {/* Modal Body */}
        <ModalBody className="py-0 mb-5 ps-0 pe-3 -me-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Address Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="input input-sm w-full"
                placeholder="Enter wallet address"
                required
              />
            </div>

            {/* Nickname Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nick Name</label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                className="input input-sm w-full"
                placeholder="Enter wallet nickname"
                required
              />
            </div>

            {/* Chain Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Chain</label>
              <select
                name="chain"
                className="select select-sm w-full"
                value={formData.chain || ''} // Handle undefined/null
                required
                onChange={(e) => handleSelectChange('chain', e.target.value)}
              >
                <option disabled value="">
                  Select Chain
                </option>
                {chains.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3">
              <button type="button" className="btn btn-sm btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-sm btn-primary">
                <KeenIcon icon={'brifecase-tick'} />
                New account
              </button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
