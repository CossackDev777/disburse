package net.disburse.controller;


import net.disburse.model.User;
import net.disburse.response.ResponseHandler;
import net.disburse.service.JwtService;
import net.disburse.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Value("${app.admin.email}")
    private String adminEmail;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @GetMapping
    public ResponseEntity<Object> getUserDetails(@RequestHeader("Authorization") String token) {

        String email = this.jwtService.extractEmail(token.split(" ")[1]);

        User response = null;
        if (email.equals(this.adminEmail)) {
            response = new User();
            response.setFirstName("Admin");
            response.setLastName("Yield");
            response.setEmail("admin@yield.market");
            response.setRole("YIELD_ADMIN");
            response.setEmailVerified(true);

            return ResponseHandler.generateResponse(HttpStatus.OK, response);
        }
        else {
            response = userService.findUser(email);
        }


        return ResponseHandler.generateResponse(HttpStatus.OK, response);
    }
}
