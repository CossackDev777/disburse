package net.disburse.service.impl;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class SendGridEmailService {
    private final SendGrid sendGrid;
    private final String displayName;
    private final String fromEmail;

    public SendGridEmailService(
            @Value("${sendgrid.api.key}") String apiKey,
            @Value("${sendgrid.default.displayName}") String displayName,
            @Value("${sendgrid.default.fromEmail}") String fromEmail) {
        
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new IllegalStateException("SendGrid API key is missing. Please set 'sendgrid.api.key' in application.properties or as an environment variable.");
        }

        this.sendGrid = new SendGrid(apiKey);
        this.displayName = displayName;
        this.fromEmail = fromEmail;
    }

    public String sendEmail(String toEmail, String subject, Content content) {
        Email from = new Email(this.fromEmail, this.displayName);
        Email to = new Email(toEmail);
        Mail mail = new Mail(from, subject, to, content);

        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sendGrid.api(request);

            return "Status Code: " + response.getStatusCode() + ", Body: " + response.getBody();
        } catch (IOException ex) {
            return "Error sending email: " + ex.getMessage();
        }
    }
}
