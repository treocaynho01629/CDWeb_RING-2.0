package com.ring.service.impl;

import com.ring.dto.response.orders.OrderDTO;
import com.ring.dto.response.orders.OrderItemDTO;
import com.ring.dto.response.orders.ReceiptDTO;
import com.ring.exception.HttpResponseException;
import com.ring.exception.PaymentException;
import com.ring.exception.ResourceNotFoundException;
import com.ring.service.PayOSService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import vn.payos.PayOS;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.ItemData;
import vn.payos.type.PaymentData;
import vn.payos.type.PaymentLinkData;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class PayOSServiceImpl implements PayOSService {

    private final PayOS payOS;

    @Value("${ring.client-url}")
    private String clientUrl;

    public CheckoutResponseData checkout(ReceiptDTO order) {

        final String description = "Thanh toán đơn hàng: #" + order.id();
        final String returnUrl = clientUrl + "/payment?state=success";
        final String cancelUrl = clientUrl + "/payment?state=cancel";
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

        // Timestamp
        LocalDateTime expired = LocalDateTime.now().plusDays(1);
        ZonedDateTime zonedDateTime = expired.atZone(ZoneId.systemDefault());
        long unixTimestamp = zonedDateTime.toEpochSecond();

        PaymentData paymentData = PaymentData.builder()
                .orderCode(order.id())
                .amount(totalPrice)
                .description(description)
                .items(items)
                .returnUrl(returnUrl)
                .cancelUrl(cancelUrl)
                .expiredAt(unixTimestamp)
                .build();

        try {
            CheckoutResponseData response = payOS.createPaymentLink(paymentData);
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            throw new PaymentException("Payment gateway error!",
                    "Không thể tạo đường dẫn thanh toán!", e);
        }
    }

    public PaymentLinkData cancel(Long id, String reason) {
        try {
            return payOS.cancelPaymentLink(id, reason);
        } catch (Exception e) {
            throw new PaymentException("Payment cancel failed!");
        }
    }

    public PaymentLinkData getPaymentLinkData(Long id) {
        try {
            PaymentLinkData order = payOS.getPaymentLinkInformation(id);
            return order;
        } catch (Exception e) {
            throw new ResourceNotFoundException("Payment data not found!",
                    "Không thể tìm thông tin thanh toán!");
        }
    }

    public String confirmWebhook(String webhookUrl) {
        try {
            return payOS.confirmWebhook(webhookUrl);
        } catch (Exception e) {
            e.printStackTrace();
            throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Invalid webhook!", e);
        }
    }
}
