package com.ring.bookstore.listener.registration;

import com.ring.bookstore.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;

@Component
@RequiredArgsConstructor
public class RegistrationListener implements ApplicationListener<OnRegistrationCompleteEvent> {

    private final EmailService emailService;

    @Override
    public void onApplicationEvent(final OnRegistrationCompleteEvent event) {
        this.welcomeRegistration(event);
    }

    private void welcomeRegistration(final OnRegistrationCompleteEvent event) {
        Context context = new Context();
        String subject = "RING! - Đăng ký thành công!";

        // Set variables for the template from the POST request data
        context.setVariable("username", event.getUsername());
        context.setVariable("subject", subject);
        emailService.sendTemplateMail(event.getEmail(),
                subject,
                "signUpEmailTemplate",
                context);
    }
}
