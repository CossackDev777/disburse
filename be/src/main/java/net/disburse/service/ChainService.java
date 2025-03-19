package net.disburse.service;

import net.disburse.dto.ChainRequestDTO;
import net.disburse.model.Chain;
import net.disburse.repository.ChainRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChainService {

    public final ChainRepository chainRepository;

    public ChainService(ChainRepository chainRepository) {
        this.chainRepository = chainRepository;
    }

    public List<Chain> getAllChains() {
        return chainRepository.findAll();
    }

    public Chain getById(Long id) {
        return chainRepository.findById(id).orElse(null);
    }

    public List<Chain> getActiveChains() {
        return chainRepository.findByIsActiveTrue();
    }

    public Chain addChain(ChainRequestDTO requestDTO) {
        Chain chain = new Chain();
        chain.setName(requestDTO.getName());
        chain.setIsActive(true);
        chainRepository.save(chain);
        return chain;
    }

    public Boolean deactivateChain(Long id) {
        Chain chain = chainRepository.findById(id).orElse(null);
        if (chain == null) {
            return false;
        }
        chain.setIsActive(false);
        chainRepository.save(chain);
        return true;
    }
}
