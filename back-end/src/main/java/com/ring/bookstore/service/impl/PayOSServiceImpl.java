package com.ring.bookstore.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ring.bookstore.exception.PaymentException;
import com.ring.bookstore.model.dto.response.CloudinaryResponse;
import com.ring.bookstore.model.dto.response.ConfirmWebhookResponse;
import com.ring.bookstore.model.dto.response.orders.OrderDTO;
import com.ring.bookstore.model.dto.response.orders.OrderItemDTO;
import com.ring.bookstore.model.dto.response.orders.ReceiptDTO;
import com.ring.bookstore.service.PayOSService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import vn.payos.PayOS;
import vn.payos.type.*;

import java.util.*;

@RequiredArgsConstructor
@Service
public class PayOSServiceImpl implements PayOSService {

    private final PayOS payOS;

    @Value("${ring.client-url}")
    private String clientUrl;

    public CheckoutResponseData checkout(ReceiptDTO order) {

        final String description = "Thanh toán đơn hàng: #" + order.id();
        final String returnUrl = clientUrl + "/profile/order";
        final String cancelUrl = clientUrl + "/payment/cancel";
        final int totalPrice = 2000;

        // Create items data
        List<ItemData> items = new ArrayList<>();
        for (OrderDTO detail : order.details()) {
            for (OrderItemDTO orderItem : detail.items()) {
                ItemData item = ItemData.builder()
                        .name(orderItem.bookTitle())
                        .quantity((int) orderItem.quantity())
                        .price((int) Math.floor(orderItem.price()))
                        .build();
                items.add(item);
            }
        }

        // Gen order code
        String currentTimeString = String.valueOf(new Date().getTime());
        long orderCode = Long.parseLong(currentTimeString.substring(currentTimeString.length() - 6));

        PaymentData paymentData = PaymentData.builder()
                .orderCode(orderCode)
                .amount(totalPrice)
                .description(description)
                .items(items)
                .returnUrl(returnUrl)
                .cancelUrl(cancelUrl)
                .build();

        try {
            CheckoutResponseData reponse = payOS.createPaymentLink(paymentData);
            return reponse;
        } catch (Exception e) {
            throw new PaymentException("Payment gateway error!", "Không thể tạo đường dẫn thanh toán!", e);
        }
    }

    public ConfirmWebhookResponse confirmWebhook(String webhookUrl) {

        ObjectMapper objectMapper = new ObjectMapper();

        try {
            String str = payOS.confirmWebhook(webhookUrl);
            JsonNode json = objectMapper.valueToTree(str);
            return ConfirmWebhookResponse.builder()
                    .code(Integer.parseInt(json.get("code").asText()))
                    .desc(json.get("desc").asText())
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}
