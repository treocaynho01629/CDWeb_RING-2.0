package com.ring.bookstore.listener;

import com.ring.bookstore.listener.checkout.OnCheckoutCompletedEvent;
import com.ring.bookstore.listener.forgot.OnResetTokenCreatedEvent;
import com.ring.bookstore.listener.registration.OnRegistrationCompleteEvent;
import com.ring.bookstore.listener.reset.OnResetPasswordCompletedEvent;
import com.ring.bookstore.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;

@Component
@RequiredArgsConstructor
public class MyEventListener {

    private final EmailService emailService;

    @Async
    @EventListener
    public void welcomeRegistration(final OnRegistrationCompleteEvent event) {
        Context context = new Context();
        String subject = "RING! - Đăng ký thành công!";

        // Set variables for the template from the POST request data
        context.setVariable("username", event.getUsername());
        context.setVariable("subject", subject);
        emailService.sendTemplateMail(event.getEmail(),
                subject,
                "welcome-email-template",
                context);
    }

    @Async
    @EventListener
    public void sendResetToken(final OnResetTokenCreatedEvent event) {
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

    @Async
    @EventListener
    public void resetNotification(final OnResetPasswordCompletedEvent event) {
        Context context = new Context();
        String subject = "RING! - Mật khẩu của bạn đã được cập nhật!";

        // Set variables for the template from the POST request data
        context.setVariable("username", event.getUsername());
        context.setVariable("subject", subject);
        emailService.sendTemplateMail(event.getEmail(),
                subject,
                "reset-email-template",
                context);
    }

    @Async
    @EventListener
    public void sendReceipt(final OnCheckoutCompletedEvent event) {
        Context context = new Context();
        String subject = "RING! - Cảm ơn vì đã mua hàng!";

        // Set variables for the template from the POST request data
        context.setVariable("username", event.getUsername());
        context.setVariable("productsTotal", event.getProductsTotal());
        context.setVariable("shippingFee", event.getShippingFee());
        context.setVariable("receipt", event.getReceipt());
        context.setVariable("subject", subject);
        emailService.sendTemplateMail(event.getEmail(),
                subject,
                "receipt-email-template",
                context);
    }
}