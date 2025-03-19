package net.disburse.repository;

import net.disburse.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findOneByEmail(String email);

    Optional<User> findOneByEmailVerificationUuid(UUID uuid);

    Optional<User> findOneByPasswordResetToken(UUID token);
}
