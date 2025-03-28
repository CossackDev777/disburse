import React, { useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@/components/modal';
import { KeenIcon } from '@/components';

import { addChain } from '@/services/wallet.service.ts';
import { IChainRequest } from '@/types/wallet.i.ts';
import { useChains } from '@/pages/views/chain/ChainContext.tsx';

interface AddChainDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddChainDialog: React.FC<AddChainDialogProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<IChainRequest>({
    name: ''
  });

  const { fetchChains } = useChains();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const is_sent = await addChain(formData);
    if (is_sent) {
      fetchChains();
      onClose();
      setFormData({
        name: ''
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
                <p>Add New Chain</p>
              </h1>
              <div className="flex items-center gap-2 text-sm font-normal text-gray-700">
                Add a new Chain to the list
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

            <div className="flex justify-end gap-3 ">
              <button type="button" className="btn btn-sm btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-sm btn-primary">
                <KeenIcon icon={'brifecase-tick'} />
                Add Chain
              </button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
