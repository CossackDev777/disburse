package net.disburse.service;

import net.disburse.model.Chain;
import net.disburse.model.Payout;
import net.disburse.repository.ChainRepository;
import net.disburse.repository.PayoutRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PayoutService {

    private final PayoutRepository payoutRepository;
    private final ChainRepository chainRepository;

    public PayoutService(PayoutRepository payoutRepository, ChainRepository chainRepository) {
        this.payoutRepository = payoutRepository;
        this.chainRepository = chainRepository;
    }

    public List<Payout> getAllNonArchivedPayouts() {
        return payoutRepository.findByArchivedFalse();
    }

    public boolean createPayout(String name, String destination, String frequency, Double amount , Long chainId) {
        try {
            Payout payout = new Payout();
            payout.setName(name);
            payout.setDestination(destination);
            payout.setFrequency(frequency);
            payout.setAmount(amount);
            payout.setArchived(false);

            Chain chain = chainRepository.findById(chainId).orElse(null);

            if (chain == null) {
                return false;
            }

            payout.setChain(chain);

            // Save to DB
            payoutRepository.save(payout);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean archivePayout(Long id) {
        try {
            Optional<Payout> optionalPayout = payoutRepository.findById(id);
            if (optionalPayout.isEmpty()) {
                return false;
            }

            Payout payout = optionalPayout.get();
            payout.setArchived(true);
            payoutRepository.save(payout);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
