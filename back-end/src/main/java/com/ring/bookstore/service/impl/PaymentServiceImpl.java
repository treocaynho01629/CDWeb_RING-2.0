package com.ring.bookstore.service.impl;

import com.ring.bookstore.exception.PaymentException;
import com.ring.bookstore.service.OrderService;
import com.ring.bookstore.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.payos.PayOS;
import vn.payos.type.Webhook;
import vn.payos.type.WebhookData;

@RequiredArgsConstructor
@Service
public class PaymentServiceImpl implements PaymentService {

    private final PayOS payOS;
    private final OrderService orderService;

    public void handlePayOS(Webhook webhookBody) {
        try {
            WebhookData data = payOS.verifyPaymentWebhookData(webhookBody);
            orderService.confirmPayment(data.getOrderCode());
        } catch (Exception e) {
            e.printStackTrace();
            throw new PaymentException("Payment receive failed!");
        }
    }
}
