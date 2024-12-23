package com.ring.bookstore.listener.forgot;

import com.ring.bookstore.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;

@Component
@RequiredArgsConstructor
public class ForgotListener implements ApplicationListener<OnResetTokenCreatedEvent> {

    private final EmailService emailService;

    @Override
    public void onApplicationEvent(final OnResetTokenCreatedEvent event) {
        this.sendResetToken(event);
    }

    private void sendResetToken(final OnResetTokenCreatedEvent event) {
        Context context = new Context();
        String subject = "RING! - Yêu cầu thay đổi mật khẩu!";

        // Set variables for the template from the POST request data
        context.setVariable("username", event.getUsername());
        context.setVariable("token", event.getToken());
        context.setVariable("subject", subject);
        emailService.sendTemplateMail(event.getEmail(),
                subject,
                "forgot-email-template",
                context);
    }
}
