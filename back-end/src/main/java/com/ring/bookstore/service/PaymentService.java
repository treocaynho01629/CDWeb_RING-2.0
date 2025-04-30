package com.ring.bookstore.service;

import vn.payos.type.Webhook;

public interface PaymentService {

    void handlePayOS(Webhook webhookBody);

}
