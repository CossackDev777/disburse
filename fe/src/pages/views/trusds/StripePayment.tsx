import React from "react";
import { useState } from "react";
import PaymentModal from "./PaymentModal";

export const StripePayment = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <button onClick={() => setIsModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded">
                Buy
            </button>
            <PaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPaymentSuccess={() => console.log("Payment Successful!")} />
        </div>
    );
}
