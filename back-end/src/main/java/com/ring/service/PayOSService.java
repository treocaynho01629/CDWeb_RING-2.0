package com.ring.service;

import com.ring.dto.response.orders.ReceiptDTO;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.PaymentLinkData;

public interface PayOSService {

    CheckoutResponseData checkout(ReceiptDTO order);

    PaymentLinkData cancel(Long id, String reason);

    PaymentLinkData getPaymentLinkData(Long id);

    String confirmWebhook(String webhookUrl);

}
