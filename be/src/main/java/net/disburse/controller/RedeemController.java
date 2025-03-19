package net.disburse.controller;
import net.disburse.service.PaymentService;
import net.disburse.service.RedeemService;
import net.disburse.service.Web3jService;

import java.math.BigInteger;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api")
public class RedeemController {

    private final RedeemService redeemService;

    public RedeemController(RedeemService redeemService) {
        this.redeemService = redeemService;
    }
    @PostMapping("/redeem-trusd")
    public ResponseEntity<RedeemResponse> redeemTRUSD(@RequestBody RedeemRequest request) {
        // Process the redeem request
        System.out.println("Redeeming TRUSD for user: " + request.getUserId());
        System.out.println("Amount: " + request.getAmount());  
        // Add your business logic here (e.g., interact with Web3j)
        try {
            redeemService.redeemToken(BigInteger.valueOf(request.getAmount()));
        } catch (Exception e) {
            // Handle the exception (e.g., log the error, show a message to the user)
            e.printStackTrace();
            // Optionally, rethrow the exception or return an error response
            throw new RuntimeException("Failed to redeem token", e);
        }
        RedeemResponse response = new RedeemResponse("success", "TRUSD redeemed successfully");
        return ResponseEntity.ok(response);
    }

    // Define a request DTO
    public static class RedeemRequest {
        private int amount;
        private String userId;

        // Getters and setters
        public int getAmount() {
            return amount;
        }

        public void setAmount(int amount) {
            this.amount = amount;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }
    }
    public static class RedeemResponse {
        private String status;
        private String message;

        public RedeemResponse(String status, String message) {
            this.status = status;
            this.message = message;
        }

        // Getters
        public String getStatus() { return status; }
        public String getMessage() { return message; }
    }
}