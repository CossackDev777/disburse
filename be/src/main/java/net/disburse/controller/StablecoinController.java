package net.disburse.controller;

import lombok.Getter;
import net.disburse.model.Stablecoin;
import net.disburse.service.StablecoinService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.extern.slf4j.Slf4j;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/stablecoin")
public class StablecoinController {
    private final StablecoinService stablecoinService;
    private static final Logger logger = LoggerFactory.getLogger(StablecoinService.class);
    // Constructor
    public StablecoinController(StablecoinService stablecoinService){
        this.stablecoinService = stablecoinService;
    }

    // GET /api/stablecoin/
    @GetMapping("/")
    public ResponseEntity<List<Stablecoin>> getAllStablecoins() {
        List<Stablecoin> stablecoins = stablecoinService.getALLNumStablecoins();
        return ResponseEntity.ok(stablecoins);
    }

    /**
     * POST /api/stablecoin/
     * Creates a new stablecoin. Returns true if successful, false otherwise.
     */

    @PostMapping("/")
    public ResponseEntity<Boolean> createStablecoin(@RequestBody StablecoinRequest request) {
        // Check or add logic (e.g., duplicates) if needed
        boolean created = stablecoinService.createStablecoin(
                request.getName(),
                request.getFullName(),
                request.getContractAddress()
        );

        if (!created) {
            // If your service returns false on failure, respond with Bad Request
            return ResponseEntity.badRequest().body(false);
        }

        // If successfully created
        return ResponseEntity.ok(true);
    }
    
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long id) {
    	logger.info("-----------", id);
        stablecoinService.deleteStablecoin(id);
        return ResponseEntity.noContent().build();
    }
}

@Getter 
class StablecoinRequest {
    private String name;
    private String fullName;
    private String contractAddress;
}

@Getter
class DeleteStablecoin {
    private String id;
}