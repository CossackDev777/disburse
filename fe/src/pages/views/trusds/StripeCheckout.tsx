import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { getAuth } from '@/auth';
// Load Stripe
const stripePromise = loadStripe("pk_test_51QzzPzP2HSHzlv0uYrmDq7U8V7q1Euzvsgc578grbngeHk2vcIT3rThboZ15E4u1gZ5emBO4TKuHHdQzGD5QiRPj00hD2qn7zN");
const auth_token = getAuth()?.access_token;
const CheckoutForm = ({ onPaymentSuccess }: { onPaymentSuccess: () => void }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [zip, setZip] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
    
        const amount = 10; // Example amount in USD
        try {
            // Step 1: Create Payment Intent
            const response = await fetch("http://localhost:8080/api/payment/create-payment-intent", {
                method: "POST",
                headers: { Authorization: `Bearer ${auth_token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ amount, currency: "usd" }),
            });
            if (!response.ok) {
                throw new Error("Failed to create payment intent. Please try again.");
            }
    
            const { clientSecret } = await response.json();
    
            if (!clientSecret || !stripe || !elements) {
                throw new Error("Payment processing is not available at the moment. Please try again later.");
            }
    
            // Step 2: Confirm Card Payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: { email, name, address: { postal_code: zip } },
                },
            });
    
            if (result.error) {
                // Handle Stripe-specific errors
                throw new Error(result.error.message || "Payment failed. Please check your card details and try again.");
            } else {
                // Payment successful
                console.log("Payment successful!");
                alert("Payment successful!");
                onPaymentSuccess();
            }
        } catch (err) {
            // Handle different types of errors
            if (err instanceof Error) {
                setError(err.message); // Set specific error message
            } else {
                setError("An unexpected error occurred while processing your payment. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-3 pt-5 bg-white rounded-lg shadow-lg w-full max-w-md">
            <input
                type="email"
                className="w-full border p-2 rounded mb-3"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            {/* Cardholder Name */}
            <input
                type="text"
                className="w-full border p-2 rounded mb-3"
                placeholder="Full name on card"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            {/* Country / ZIP */}
            <div className="flex space-x-2">
                <select className="border p-2 rounded w-2/3">
                    <option>United States</option>
                </select>
                <input
                    type="text"
                    className="border p-2 rounded w-1/3"
                    placeholder="ZIP"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    required
                />
            </div>
            {/* Card Element */}
            <CardElement options={{ hidePostalCode: true }} className="p-5" />

            {/* Error Message */}
            {error && <div className="text-red-500 text-sm mt-3">{error}</div>}

            <button type="submit" disabled={!stripe || loading} className="mt-10 bg-blue-500 text-white px-4 py-2 rounded group w-full">
                {loading ? "Processing..." : "Confirm Payment"}
            </button>
        </form>
    );
};

const StripeCheckout = ({ onPaymentSuccess }: { onPaymentSuccess: () => void }) => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm onPaymentSuccess={onPaymentSuccess} />
        </Elements>
    );
};

export default StripeCheckout;