package net.disburse.controller;
import com.stripe.model.PaymentIntent;

import net.disburse.service.PaymentService;
import net.disburse.service.Web3jService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.math.BigInteger;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    private final PaymentService paymentService;
    private final Web3jService web3jService;
    public PaymentController(PaymentService paymentService, Web3jService web3jService) {
        this.paymentService = paymentService;
        this.web3jService = web3jService;
    }

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPayment(@RequestBody Map<String, Object> request) {
        Map<String, String> response = new HashMap<>();
        try {
            // Extract amount and useUSDC from the request
            Long amount = Long.parseLong(request.get("amount").toString());
            boolean useUSDC = Boolean.parseBoolean(request.get("useUSDC").toString());

            // Call Stripe Payment Service
            PaymentIntent paymentIntent = paymentService.createPaymentIntent(amount);
            response.put("clientSecret", paymentIntent.getClientSecret());

            // Call Web3j mint function
            String transactionHash = web3jService.mintToken(BigInteger.valueOf(amount), useUSDC);
            response.put("transactionHash", transactionHash);

        } catch (Exception e) {
            response.put("error-payment", e.getMessage());
        }
        return ResponseEntity.ok(response);
    }
    // public String buyToken(@RequestParam BigInteger amount, @RequestParam boolean useUSDC) {
    //     try {
    //         return web3jService.mintToken(amount, useUSDC);
    //     } catch (Exception e) {
    //         return "Error: " + e.getMessage();
    //     }
    // }
}