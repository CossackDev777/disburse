package net.disburse.service.impl;


import net.disburse.exception.InvalidException;
import net.disburse.exception.NotFoundException;
import net.disburse.model.User;
import net.disburse.repository.UserRepository;
import net.disburse.util.UserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements UserDetailsService {

    @Value("${app.admin.email}")
    private String adminEmail;
    @Autowired
    private UserRepository repository;

    @Override
    public UserDetails loadUserByUsername(String email) throws NotFoundException, InvalidException {

        if (email.equals("NONE_PROVIDED")) {
            throw new InvalidException("Invalid Fields");
        }

        if (email.equals(this.adminEmail)) {

            User user = new User();
            user.setFirstName("Admin");
            user.setLastName("Yield");
            user.setEmail("admin@yield.market");
            user.setRole("DISBURSE_ADMIN");
            return new UserInfo(user);
        }

        return repository.findOneByEmail(email)
          .map(UserInfo::new)
          .orElseThrow(() -> new NotFoundException("User not found " + email));
    }
}
