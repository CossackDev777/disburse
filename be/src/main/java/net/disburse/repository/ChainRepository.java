package net.disburse.repository;

import net.disburse.model.Chain;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChainRepository extends JpaRepository<Chain, Long> {
    Chain findByName(String name);
    List<Chain> findByIsActiveTrue();
}
