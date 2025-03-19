package net.disburse.service.impl;


import com.sendgrid.helpers.mail.objects.Content;
import lombok.extern.slf4j.Slf4j;
import net.disburse.dto.AuthRequest;
import net.disburse.dto.ThemeRequest;
import net.disburse.dto.UserDetailsDTO;
import net.disburse.dto.UserSignUpDTO;
import net.disburse.exception.*;
import net.disburse.model.User;
import net.disburse.repository.UserRepository;
import net.disburse.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Value("${client.domain.url}")
    private String clientURL;
    @Value("${client.email.verification.url}")
    private String emailVerificationURL;
    @Value("${client.reset.token.verification.url}")
    private String resetTokenVerificationURL;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder encoder;
    @Autowired
    private SendGridEmailService sendGridEmailService;
    @Autowired
    private ReCaptchaService reCaptchaService;

    @Override
    public UserDetailsDTO registerUser(UserSignUpDTO userSignUpDTO) {

        boolean isCaptchaValid = reCaptchaService.verifyReCaptcha(userSignUpDTO.getCaptchaToken());

        if (!isCaptchaValid) {
            throw new RecaptchaException("reCAPTCHA verification failed");
        }

        if (userRepository.findOneByEmail(userSignUpDTO.getEmail())
          .isPresent()) {
            throw new ExistException("User already exists");
        }

        if (userSignUpDTO.getRole() == null || userSignUpDTO.getRole()
          .isEmpty()) {
            throw new IllegalArgumentException("At least one role is required for a user");
        }

        String role = userSignUpDTO.getRole();

        if ((!role.equals("DISBURSE_ADMIN") && !role.equals("DISBURSE_USER"))) {
            throw new InvalidException("Invalid role: " + role);
        }


        User user = new User();
        user.setFirstName(userSignUpDTO.getFirstName());
        user.setLastName(userSignUpDTO.getLastName());
        user.setEmail(userSignUpDTO.getEmail());
        user.setPassword(encoder.encode(userSignUpDTO.getPassword()));
        user.setRole(role);
        user.setEmailVerificationUuid(UUID.randomUUID());
        user.setEmailVerificationSentAt(LocalDateTime.now());

        User userResponse = this.userRepository.save(user);

        return new UserDetailsDTO(userResponse.getFirstName(), userResponse.getLastName(), userResponse.getEmail(),
          userResponse.getRole(), userResponse.getEmailVerificationUuid(), userResponse.getEmailVerificationSentAt());
    }

    private void sendVerificationEmail(User userResponse) {

        String verificationUrl = this.clientURL + this.emailVerificationURL + "/" + userResponse.getEmailVerificationUuid()
          .toString();

        Content content = new Content("text/html",
          "<p>Thank you for registering!</p>" +
            "<p>Please verify your email by clicking on the link below:</p>" +
            "<a href='" + verificationUrl + "'>Verify Email</a>");

        String response = this.sendGridEmailService.sendEmail(userResponse.getEmail(), "Email Verification", content);

    }

    private void sendResetPasswordEmail(User userResponse) {

        String verificationUrl = this.clientURL + this.resetTokenVerificationURL + "/" + userResponse.getPasswordResetToken()
          .toString();

        Content content = new Content("text/html",
          "<p>We received a request to reset your password. To proceed, click the link below:</p>" +
            "<a href='" + verificationUrl + "'>Reset Password</a>");

        String response = this.sendGridEmailService.sendEmail(userResponse.getEmail(), "Reset Password", content);

    }

    @Override
    public UserDetailsDTO verifyEmail(UUID uuid) {
        if (uuid == null || uuid.toString()
          .isEmpty()) {
            throw new InvalidException("Email verification UUID required!");
        }

        User user = userRepository.findOneByEmailVerificationUuid(uuid)
          .orElseThrow(() -> new InvalidException("Invalid Email verification UUID: " + uuid));

        if (user.getEmailVerified()) {
            throw new ExistException("Email already verified!");
        }

        LocalDateTime verificationTime = user.getEmailVerificationSentAt();
        if (verificationTime.isBefore(LocalDateTime.now()
          .minusHours(2))) {
            user.setEmailVerificationUuid(UUID.randomUUID());
            user.setEmailVerificationSentAt(LocalDateTime.now());
            User userResponse = userRepository.save(user);

            this.sendVerificationEmail(userResponse);
            throw new UnauthorizedException("Verification time has expired, Sending new verification email!");
        }

        user.setEmailVerified(true);
        User userResponse = userRepository.save(user);

        return new UserDetailsDTO(userResponse.getFirstName(), userResponse.getLastName(), userResponse.getEmail(),
          userResponse.getRole(), userResponse.getEmailVerificationUuid(), userResponse.getEmailVerificationSentAt());
    }

    @Override
    public UserDetailsDTO verifyResetToken(UUID token) {
        if (token == null || token.toString()
          .isEmpty()) {
            throw new InvalidException("Password Reset Token required!");
        }

        User user = userRepository.findOneByPasswordResetToken(token)
          .orElseThrow(() -> new InvalidException("Invalid Password Reset Token: " + token));

        user.setPasswordResetToken(null);
        User userResponse = userRepository.save(user);

        return new UserDetailsDTO(userResponse.getFirstName(), userResponse.getLastName(), userResponse.getEmail(),
          userResponse.getRole(), userResponse.getEmailVerificationUuid(), userResponse.getEmailVerificationSentAt());
    }

    @Override
    public Boolean sendVerificationEmail(String email) {

        User userResponse = userRepository.findOneByEmail(email)
          .orElseThrow(() -> new NotFoundException("Email: " + email + " does not exists."));

        userResponse.setEmailVerificationUuid(UUID.randomUUID());
        userResponse.setEmailVerificationSentAt(LocalDateTime.now());
        userResponse.setEmailVerified(false);

        userResponse = this.userRepository.save(userResponse);

        this.sendVerificationEmail(userResponse);

        return true;
    }

    @Override
    public Boolean sendPasswordResetEmail(String email) {
        User userResponse = userRepository.findOneByEmail(email)
          .orElseThrow(() -> new NotFoundException("Email: " + email + " does not exists."));

        userResponse.setPasswordResetToken(UUID.randomUUID());
        userResponse = this.userRepository.save(userResponse);

        this.sendResetPasswordEmail(userResponse);

        return true;
    }

    @Override
    public Boolean resetPassword(AuthRequest authRequest) {
        User userResponse = userRepository.findOneByEmail(authRequest.getEmail())
          .orElseThrow(() -> new NotFoundException("Email: " + authRequest.getEmail() + " does not exists."));

        userResponse.setPassword(encoder.encode(authRequest.getPassword()));

        this.userRepository.save(userResponse);

        return true;
    }

    @Override
    public User findUser(String email) {

        User user = userRepository.findOneByEmail(email)
          .orElseThrow(() -> new NotFoundException("User not found " + email));

        return generateResponse(user);
    }

    @Override
    public Boolean updateTheme(ThemeRequest themeRequest, Integer userId) {
        User user = userRepository.findById(userId)
          .orElseThrow(() -> new NotFoundException("User not found " + userId));

        user.setTheme(themeRequest.getTheme());

        this.userRepository.save(user);

        return true;
    }

    private User generateResponse(User user) {
        User response = new User();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setEmailVerified(user.getEmailVerified());
        response.setRole(user.getRole());
        response.setTheme(user.getTheme());
        return response;
    }

}
