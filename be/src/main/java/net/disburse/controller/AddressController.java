package net.disburse.controller;

import net.disburse.dto.AddressRequest;
import net.disburse.dto.TransactionAddressReq;
import net.disburse.exception.UnauthorizedException;
import net.disburse.model.Address;
import net.disburse.model.Chain;
import net.disburse.model.Transaction;
import net.disburse.model.User;
import net.disburse.repository.AddressRepository;
import net.disburse.repository.JDBCRepository;
import net.disburse.repository.UserRepository;
import net.disburse.service.AddressService;
import net.disburse.service.ChainService;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/address")
public class AddressController {
    private final AddressService addressService;
    private final ChainService chainService;
    private final JDBCRepository jdbcRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    public AddressController(AddressService addressService, ChainService chainService, JDBCRepository jdbcRepository, UserRepository userRepository, AddressRepository addressRepository) {
        this.addressService = addressService;
        this.chainService = chainService;
        this.jdbcRepository = jdbcRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
    }

    @PostMapping("/")
    public ResponseEntity<Boolean> saveNewAddress(@RequestBody AddressRequest addressRequest) {

        boolean saveAddress = false;
        User user = userRepository.findById(addressRequest.getUserId()).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body(false);
        }

        boolean checkExisting = addressService.checkExistingAddress(addressRequest.getAddress());

        try {

            if (checkExisting) {
//            return ResponseEntity.badRequest().body(false);
                Address existingAddress = addressService.getAddressByAddress(addressRequest.getAddress());
                jdbcRepository.addAddressUserInterest(existingAddress.getId(), user.getId());
                return ResponseEntity.ok(true);
            }

            if (addressRequest.getNickname() == null || addressRequest.getNickname().isEmpty()) {
                return ResponseEntity.badRequest().body(false);
            }

        /*if(addressRequest.getChain() == 0) {
            return ResponseEntity.badRequest().body(false);
        }*/

            Chain chain = chainService.getById(addressRequest.getChain());

            if (chain == null) {
                return ResponseEntity.badRequest().body(false);
            }

            saveAddress = addressService.addNewAddress(addressRequest.getAddress(), addressRequest.getNickname(), chain);

            Address address = addressService.getAddressByAddress(addressRequest.getAddress());

            jdbcRepository.addAddressUserInterest(address.getId(), user.getId());

            Map<String, Map<String, String>> saveBalance = addressService.savePortfolio(address.getId());
        } catch (UnauthorizedException ex) {
            return ResponseEntity.badRequest().body(false);
        } catch (DuplicateKeyException ex) {
//            Address and user are already together
            return ResponseEntity.status(403).body(false);
        }



        return ResponseEntity.ok(saveAddress);
    }

    @GetMapping("/balances/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getAllBalances(@PathVariable Integer userId) {
        List<Map<String, Object>> allAddresses = addressService.getAllBalancesForUser(userId);

        return ResponseEntity.ok(allAddresses);
    }

    @PutMapping("/portfolio/")
    public ResponseEntity<Map<String, Map<String, String>>> updatePortfolio() {
        Map<String, Map<String, String>> updateBalance = addressService.updatePortfolio();

        return ResponseEntity.ok(updateBalance);
    }

    @PostMapping("/portfolio/transactions/refresh")
    public ResponseEntity<List<Transaction>> refreshTransactions(@RequestBody TransactionAddressReq address) {
        try {
            List<Transaction> list = addressService.getLastTransactions(address.getAddress());

            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @PostMapping("/portfolio/transactions/")
    public ResponseEntity<List<Map<String, Object>>> getTransactions(@RequestBody TransactionAddressReq address) {
        List<Map<String, Object>> list = addressService.getTransactionsFromDb(address.getAddress());

        return ResponseEntity.ok(list);
    }
}



