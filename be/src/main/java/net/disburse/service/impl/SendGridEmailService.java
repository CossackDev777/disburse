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

    @Value("${sendgrid.default.displayName}")
    private String displayName;

    @Value("${sendgrid.default.fromEmail}")
    private String fromEmail;

    public SendGridEmailService(@Value("${sendgrid.api.key}") String apiKey) {
        this.sendGrid = new SendGrid(apiKey);
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
            return "Error sending email";
        }
    }

}
