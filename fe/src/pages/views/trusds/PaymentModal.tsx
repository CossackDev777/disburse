import { useEffect, useState } from "react";
import StripeCheckout from "./StripeCheckout";
import PaymentForm from "./PaymentForm";
const PaymentModal = ({ isOpen, onClose, onPaymentSuccess }: { isOpen: boolean; onClose: () => void; onPaymentSuccess: () => void }) => {
    if (!isOpen) return null;
    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-100">
                <div className="bg-white p-5 rounded shadow-lg w-146">
                    <div className="flex">
                        <h2 className="text-lg font-bold mb-4">Payment</h2>
                        
                        <button onClick={onClose} type="button" className="text-black-700 bg-transparent hover:bg-gray-500 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <StripeCheckout onPaymentSuccess={onPaymentSuccess}/>
                    {/* <PaymentForm /> */}
                </div>
            </div>

        </>
    );
};

export default PaymentModal;