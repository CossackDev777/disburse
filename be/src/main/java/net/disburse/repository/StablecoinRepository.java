package net.disburse.repository;

import net.disburse.model.Stablecoin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StablecoinRepository extends JpaRepository<Stablecoin, Long> {
    
    Stablecoin findByName(String name);
    
    List<Stablecoin> findAll();
}

