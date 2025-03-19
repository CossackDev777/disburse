package net.disburse.controller;

import lombok.extern.slf4j.Slf4j;
import net.disburse.dto.*;
import net.disburse.exception.UnauthorizedException;
import net.disburse.model.User;
import net.disburse.response.ResponseHandler;
import net.disburse.service.JwtService;
import net.disburse.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<Object> signup(@RequestBody UserSignUpDTO userSignUpDTO) {
        log.info("Attempting to register user with email: {}", userSignUpDTO.getEmail());
        log.info("Attempting to register user with password: {}", userSignUpDTO.getPassword());
        UserDetailsDTO response = userService.registerUser(userSignUpDTO);
        return ResponseHandler.generateResponseOld("User registered successfully", HttpStatus.CREATED, response);
    }

    @GetMapping("/verify-email/{uuid}")
    public ResponseEntity<Object> verifyEmail(@PathVariable("uuid") UUID uuid) {
        UserDetailsDTO response = userService.verifyEmail(uuid);

        log.info("Email Verified Successfully");
        return ResponseHandler.generateResponseOld("Email Verified Successfully", HttpStatus.ACCEPTED, response);

    }

    @PostMapping("/request-verification-email")
    public ResponseEntity<Object> sendEmail(@RequestBody EmailRequest emailActionRequest) {

        Boolean successful = userService.sendVerificationEmail(emailActionRequest.getEmail());
        if (Boolean.TRUE.equals(successful)) {
            log.info("Verification email sent successfully");
            return ResponseHandler.generateMessage("Verification Email Send Successfully", HttpStatus.OK);
        }
        else {
            log.error("Failed to send verification email");
            return ResponseHandler.generateMessage("Something Went Wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/verify-reset-token/{token}")
    public ResponseEntity<Object> verifyResetPasswordToken(@PathVariable("token") UUID token) {
        UserDetailsDTO response = userService.verifyResetToken(token);

        log.info("Reset Password Token Verified Successfully");
        return ResponseHandler.generateResponseOld("Reset Password Token Verified Successfully", HttpStatus.ACCEPTED,
          response);

    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Object> forgotPassword(@RequestBody EmailRequest emailActionRequest) {

        Boolean successful = userService.sendPasswordResetEmail(emailActionRequest.getEmail());
        if (Boolean.TRUE.equals(successful)) {
            log.info("Password reset email sent successfully");
            return ResponseHandler.generateMessage("Password Reset Email Sent Successfully", HttpStatus.OK);
        }
        else {
            log.error("Failed to send password reset email");
            return ResponseHandler.generateMessage("Something Went Wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping("/reset-password")
    public ResponseEntity<Object> resetPassword(@RequestBody AuthRequest authRequest) {

        Boolean successful = userService.resetPassword(authRequest);
        if (Boolean.TRUE.equals(successful)) {
           log.info("Password reset successfully");
           return ResponseHandler.generateMessage("Password Reset Successfully", HttpStatus.OK);
        }
        else {
           log.error("Failed to reset password");
            return ResponseHandler.generateMessage("Something Went Wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping("/login")
    public ResponseEntity<Object> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {

        try {
            if (authRequest.getEmail()
              .equals(this.adminEmail) && authRequest.getPassword()
              .equals(this.adminPassword)) {
                GrantedAuthority adminAuthority = new SimpleGrantedAuthority("DISBURSE_ADMIN");
                Collection<? extends GrantedAuthority> authorities = List.of(adminAuthority);
                Map<String, Object> map = new HashMap<String, Object>();
                UserResponse userDetailsDTO = new UserResponse(
                        0,
                        "DISBURSE",
                        "ADMIN",
                        adminEmail,
                        "DISBURSE_ADMIN",
                        "light");
                String token = jwtService.generateToken(authRequest.getEmail(), authorities);

                map.put("access_token", token);
                map.put("user", userDetailsDTO);
                return new ResponseEntity<Object>(map, HttpStatus.OK);
            }
            else {
                Authentication authentication = authenticationManager.authenticate(
                  new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
                if (authentication.isAuthenticated()) {
                    Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
                    String token = jwtService.generateToken(authRequest.getEmail(), authorities);

                    User loggedUser = userService.findUser(authRequest.getEmail());
                    Map<String, Object> map = new HashMap<String, Object>();
                    UserResponse userDetailsDTO = new UserResponse(
                            loggedUser.getId(),
                            loggedUser.getFirstName(),
                            loggedUser.getLastName(),
                            loggedUser.getEmail(),
                            loggedUser.getRole(),
                            loggedUser.getTheme());
                    log.info("User logged in successfully");
                    map.put("access_token", token);
                    map.put("user", userDetailsDTO);
                    return new ResponseEntity<Object>(map, HttpStatus.OK);
                }
                else {
                    throw new UnauthorizedException("Unauthorized!");
                }
            }

        } catch (AuthenticationException | UnauthorizedException e) {
            log.error("Failed to authenticate user", e);
            return ResponseHandler.generateMessage("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

    }

    @PutMapping("/update-theme/{userId}")
    public ResponseEntity<Object> updateTheme(@RequestBody ThemeRequest themeRequest, @PathVariable Integer userId) {

        log.info("Attempting to update theme for user with id: {} to {}", userId, themeRequest.getTheme());
        Boolean successful = userService.updateTheme(themeRequest, userId);
        if (Boolean.TRUE.equals(successful)) {
            log.info("Theme updated successfully");
            return ResponseHandler.generateMessage("Theme Updated Successfully", HttpStatus.OK);
        }
        else {
            log.error("Failed to update theme");
            return ResponseHandler.generateMessage("Something Went Wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
