package net.disburse.service;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.stereotype.Service;
@Service
public class PaymentService {
    public PaymentIntent createPaymentIntent(Long amount) throws Exception {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(amount) // Amount in cents (e.g., 1000 = $10)
            .setCurrency("usd")
            .addPaymentMethodType("card") // Correct way in Stripe 24.0.0+
            .build();

        return PaymentIntent.create(params);
    }
    
}
