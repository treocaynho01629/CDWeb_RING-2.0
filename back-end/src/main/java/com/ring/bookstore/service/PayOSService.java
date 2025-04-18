package com.ring.bookstore.service;

import com.ring.bookstore.model.dto.response.ConfirmWebhookResponse;
import com.ring.bookstore.model.dto.response.orders.ReceiptDTO;
import vn.payos.type.CheckoutResponseData;

public interface PayOSService {

    CheckoutResponseData checkout(ReceiptDTO order);

    ConfirmWebhookResponse confirmWebhook(String webhookUrl);

}
