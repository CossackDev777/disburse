package net.disburse.service;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import net.disburse.controller.PayoutController;
import net.disburse.model.Stablecoin;
import net.disburse.repository.StablecoinRepository;

@Slf4j
@Service
public class StablecoinService {    
    public final StablecoinRepository stablecoinRepository;

    public StablecoinService(StablecoinRepository stablecoinRepository) {
        this.stablecoinRepository = stablecoinRepository;
    }

    public List<Stablecoin> getALLNumStablecoins() {
        return stablecoinRepository.findAll();
    }

    public boolean createStablecoin(String name, String fullname, String contractaddress ) {
    	try {
    		Stablecoin stablecoin = new Stablecoin();
    		stablecoin.setName(name);
    		stablecoin.setFullName(fullname);
    		stablecoin.setContractAddress(contractaddress);
    		
    		stablecoinRepository.save(stablecoin);
    		return true;
    	} catch (Exception e){
            e.printStackTrace();
    		return false;
    	}
    }
    public void deleteStablecoin(Long id) {
        stablecoinRepository.deleteById(id);
    }
   
}