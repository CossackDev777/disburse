import React, { useMemo, useState } from "react";
import { Modal, ModalBody, ModalContent, ModalHeader } from '@/components/modal';
import { DataGrid, KeenIcon } from '@/components';
import Web3 from "web3"
import { assert } from "console";
import { Stablecoins } from '../stablecoins/stablecoin-table/Stablecoins';

interface TrusdDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TrusdDialog: React.FC<TrusdDialogProps> = ({ isOpen, onClose }) => {

    //balance of etherscan
    var balance;
    const INFURA_URL = "https://mainnet.infura.io/v3/c93cfa56e46948db8916111ab20f4714";
    const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_URL));

    // Your Smart Contract Address
    const contractAddress = "0x6b5E4921aCDb2f63960cD4ad7b4169DD92142850";
    async function getBalance() {
        try {
            balance = await web3.eth.getBalance(contractAddress);
            console.log(`Balance: ${web3.utils.fromWei(balance, "ether")} ETH`);
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    }

    getBalance();
    const [formData, setFormData] = useState({
        TRUSD: 'TRUSD',
        contractAddress: localStorage.connectedAccount,
        balance: balance
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.TRUSD}
                                    onChange={handleInputChange}
                                    className="input input-sm w-full"
                                    placeholder="Enter name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contract_address</label>
                                <input
                                    type="text"
                                    name="Contract Address"
                                    value={formData.contractAddress}
                                    onChange={handleInputChange}
                                    className="input input-sm w-full"
                                    placeholder="Enter contract_address"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contract_address</label>
                                <input
                                    name="contractAddress"
                                    value={formData.balance}
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