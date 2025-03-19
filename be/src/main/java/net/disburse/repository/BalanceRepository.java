package net.disburse.repository;

import net.disburse.model.Address;
import net.disburse.model.Balance;
import net.disburse.model.Stablecoin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BalanceRepository extends JpaRepository<Balance, Long> {
    Balance findByAddressAndStablecoin(Address address, Stablecoin stablecoin);

    List<Balance> findByAddressIn(List<Address> addresses);

}
