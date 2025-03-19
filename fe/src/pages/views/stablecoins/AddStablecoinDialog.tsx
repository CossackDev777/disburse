import React, { useState } from "react";

import { Modal, ModalBody, ModalContent, ModalHeader } from '@/components/modal';
import { IStablecoin } from "@/types/wallet.i";
import { KeenIcon } from '@/components';

import { IStablecoinRequest } from "@/types/wallet.i";
import { useStablecoins } from "./StablecoinContext";
import { addStablecoin } from "@/services/stablecoin.service"

interface AddStablecoinDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddStablecoinDialog: React.FC<AddStablecoinDialogProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<IStablecoinRequest>({
        name: '',
        fullName: '',
        contractAddress: ''
    });

    const { fetchStablecoins } = useStablecoins();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
        const is_sent = await addStablecoin(formData);
        if (is_sent) {
            fetchStablecoins();
            onClose();
            setFormData({
                name: '',
                fullName: '',
                contractAddress: ''
            });
        }
    };

    return (
        <>
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
                                    <p>Add New Stablecoin</p>
                                </h1>
                                <div className="flex items-center gap-2 text-sm font-normal text-gray-700">
                                    Add a new Stablecoin to your stablecoin.
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
                                <label className="block text-sm font-medium text-gray-700">Full name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="input input-sm w-full"
                                    placeholder="Enter fullname"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contract_address</label>
                                <input
                                    type="text"
                                    name="contractAddress"
                                    value={formData.contractAddress}
                                    onChange={handleInputChange}
                                    className="input input-sm w-full"
                                    placeholder="Enter contract_address"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 ">
                                <button type="button" className="btn btn-sm btn-outline" onClick={onClose}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-sm btn-primary" >
                                    <KeenIcon icon={'brifecase-tick'} />
                                    Add Stablecoin
                                </button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )


}