package net.disburse.service;

import net.disburse.dto.AuthRequest;
import net.disburse.dto.ThemeRequest;
import net.disburse.dto.UserDetailsDTO;
import net.disburse.dto.UserSignUpDTO;
import net.disburse.model.User;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public interface UserService {
    public UserDetailsDTO registerUser(UserSignUpDTO userSignUpDTO);

    public UserDetailsDTO verifyEmail(UUID uuid);

    public Boolean sendVerificationEmail(String email);

    public Boolean sendPasswordResetEmail(String email);

    public UserDetailsDTO verifyResetToken(UUID token);

    public Boolean resetPassword(AuthRequest authRequest);

    public User findUser(String email);

    public Boolean updateTheme(ThemeRequest themeRequest, Integer userId);
}
