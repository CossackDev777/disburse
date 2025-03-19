package net.disburse.repository;

import net.disburse.model.Address;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class JDBCRepository {
    private final JdbcTemplate jdbcTemplate;

    public JDBCRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void addAddressUserInterest(Long addressId, Integer userId) {
        String sql = "INSERT INTO address_user_interest (address_id, user_id) VALUES (?, ?)";
        jdbcTemplate.update(sql, addressId, userId);
    }

   public List<Long> getAddressByUserId(Integer userId) {
        String sql = "SELECT address_id FROM address_user_interest WHERE user_id = ?";
        return jdbcTemplate.queryForList(sql, Long.class, userId);
    }
}
