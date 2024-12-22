package com.ring.bookstore.listener.checkout;

import com.ring.bookstore.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;

@Component
@RequiredArgsConstructor
public class CheckoutListener implements ApplicationListener<OnCheckoutCompletedEvent> {

    private final EmailService emailService;

    @Override
    public void onApplicationEvent(final OnCheckoutCompletedEvent event) {
        this.sendReceipt(event);
    }

    private void sendReceipt(final OnCheckoutCompletedEvent event) {
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
                "receiptEmailTemplate",
                context);
    }
}
