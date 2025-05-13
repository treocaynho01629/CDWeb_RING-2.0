package com.ring.service.impl;

import com.ring.exception.PaymentException;
import com.ring.service.OrderService;
import com.ring.service.PaymentService;
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
