package net.disburse.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import net.disburse.service.StripeService;
import com.stripe.model.PaymentIntent;
import com.stripe.exception.StripeException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stripe")
public class StripeController {

    @Autowired
    private StripeService stripeService;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(
            @RequestParam("amount") long amount,
            @RequestParam("currency") String currency) throws StripeException {
        
        PaymentIntent paymentIntent = stripeService.createPaymentIntent(amount, currency);

        Map<String, String> response = new HashMap<>();
        response.put("clientSecret", paymentIntent.getClientSecret());

        return ResponseEntity.ok(response);
    }
}