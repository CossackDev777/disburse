package net.disburse.service.impl;


import net.disburse.dto.ReCaptchaResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class ReCaptchaService {
    @Value("${recaptcha.secret.key}")
    private String secretKey;

    private static final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    public boolean verifyReCaptcha(String token) {
        RestTemplate restTemplate = new RestTemplate();

        // Build the verification request URL
        String url = UriComponentsBuilder.fromHttpUrl(VERIFY_URL)
          .queryParam("secret", secretKey)
          .queryParam("response", token)
          .toUriString();

        // Send the request to Google reCAPTCHA API
        ReCaptchaResponse response = restTemplate.postForObject(url, null, ReCaptchaResponse.class);

        // Verify the response is successful and score is above the threshold (e.g., 0.5)
        return response != null && response.isSuccess() && response.getScore() >= 0.5;
    }
}
