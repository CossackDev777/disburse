package net.disburse.controller;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import net.disburse.model.Payout;
import net.disburse.service.PayoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.List;

/**
 * Controller for managing Payouts, following a style similar to AddressController.
 */
@Slf4j
@RestController
@RequestMapping("/api/payout")
public class PayoutController {

    private final PayoutService payoutService;

    public PayoutController(PayoutService payoutService) {
        this.payoutService = payoutService;
    }

    /**
     * GET /api/payout/
     * Returns a list of non-archived payouts (or possibly all, depending on the service method).
     */
    @GetMapping("/")
    public ResponseEntity<List<Payout>> getAllPayouts() {
        // Service call to retrieve all non-archived payouts
        List<Payout> payouts = payoutService.getAllNonArchivedPayouts();
        return ResponseEntity.ok(payouts);
    }

    /**
     * POST /api/payout/
     * Creates a new payout. Returns true if successful, false otherwise.
     */
    @PostMapping("/")
    public ResponseEntity<Boolean> createPayout(@RequestBody PayoutRequest request) {
        // Check or add logic (e.g., duplicates) if needed
        boolean created = payoutService.createPayout(
                request.getName(),
                request.getDestination(),
                request.getFrequency(),
                request.getAmount(),
                request.getChain()
        );

        if (!created) {
            // If your service returns false on failure, respond with Bad Request
            return ResponseEntity.badRequest().body(false);
        }

        // If successfully created
        return ResponseEntity.ok(true);
    }

    /**
     * PUT /api/payout/archive/
     * Archives (soft-deletes) a payout by marking it 'archived = true'.
     */
    @PutMapping("/archive/")
    public ResponseEntity<Boolean> archivePayout(@RequestBody PayoutArchiveReq archiveReq) {
        log.info("Archiving payout with id: {}", archiveReq.getId());
        boolean archived = payoutService.archivePayout(archiveReq.getId());

        if (!archived) {
            log.error("Failed to archive payout");
            return ResponseEntity.badRequest().body(false);
        }

        log.info("Payout archived successfully");

        return ResponseEntity.ok(true);
    }
}

@Getter
class PayoutRequest {
    private String name;
    private String destination;
    private String frequency;
    private Double amount;
    private Long chain;
}

@Getter
class PayoutArchiveReq {
    private Long id;
}
