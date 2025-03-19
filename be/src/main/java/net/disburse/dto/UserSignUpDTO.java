package net.disburse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSignUpDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String role;
    private String captchaToken;
}
