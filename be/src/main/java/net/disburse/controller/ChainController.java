package net.disburse.controller;

import lombok.Getter;
import net.disburse.dto.ChainRequestDTO;
import net.disburse.model.Chain;
import net.disburse.service.ChainService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chain")
public class ChainController {


    private final ChainService chainService;

    public ChainController(ChainService chainService) {
        this.chainService = chainService;
    }


    /**
     * GET /api/chain/
     * Returns a list of all chains.
     */
    @GetMapping("/all/active")
    public ResponseEntity<List<Chain>> getAllActiveChains() {
        // Service call to retrieve all chains
        List<Chain> chains = chainService.getActiveChains();
        return ResponseEntity.ok(chains);
    }

    @PostMapping("/add")
    public ResponseEntity<Chain> addChain(@RequestBody ChainRequestDTO request) {
        Chain chain = chainService.addChain(request);
        return ResponseEntity.ok(chain);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Chain>> getAllChains() {
        List<Chain> chains = chainService.getAllChains();
        return ResponseEntity.ok(chains);
    }

    @PutMapping("/archive/{id}")
    public ResponseEntity<Boolean> deactivateChain(@PathVariable Long id) {
        boolean deactivated = chainService.deactivateChain(id);
        return ResponseEntity.ok(deactivated);
    }



}
