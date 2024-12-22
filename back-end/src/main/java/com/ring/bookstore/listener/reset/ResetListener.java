package com.ring.bookstore.listener.reset;

import com.ring.bookstore.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;

@Component
@RequiredArgsConstructor
public class ResetListener implements ApplicationListener<OnResetPasswordCompletedEvent> {

    private final EmailService emailService;

    @Override
    public void onApplicationEvent(final OnResetPasswordCompletedEvent event) {
        this.resetNotification(event);
    }

    private void resetNotification(final OnResetPasswordCompletedEvent event) {
        Context context = new Context();
        String subject = "RING! - Mật khẩu của bạn đã được cập nhật!";

        // Set variables for the template from the POST request data
        context.setVariable("username", event.getUsername());
        context.setVariable("subject", subject);
        emailService.sendTemplateMail(event.getEmail(),
                subject,
                "resetEmailTemplate",
                context);
    }
}
