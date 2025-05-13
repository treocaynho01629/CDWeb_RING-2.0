package com.ring.service;

import com.ring.dto.request.CalculateRequest;
import com.ring.dto.request.OrderRequest;
import com.ring.dto.response.PagingResponse;
import com.ring.dto.response.dashboard.ChartDTO;
import com.ring.dto.response.dashboard.StatDTO;
import com.ring.dto.response.orders.*;
import com.ring.model.entity.Account;
import com.ring.model.entity.PaymentInfo;
import com.ring.model.enums.OrderStatus;
import com.ring.model.enums.PaymentType;
import jakarta.servlet.http.HttpServletRequest;
import vn.payos.type.PaymentLinkData;

import java.util.List;

public interface OrderService {

    PagingResponse<ReceiptDTO> getAllReceipts(Account user,
                                              Long shopId,
                                              OrderStatus status,
                                              String keyword,
                                              Integer pageNo,
                                              Integer pageSize,
                                              String sortBy,
                                              String sortDir);

    PagingResponse<ReceiptSummaryDTO> getSummariesWithFilter(Account user,
                                                             Long shopId,
                                                             Long bookId,
                                                             Integer pageNo,
                                                             Integer pageSize,
                                                             String sortBy,
                                                             String sortDir);

    PagingResponse<OrderDTO> getOrdersByBookId(Long id,
                                               Integer pageNo,
                                               Integer pageSize,
                                               String sortBy,
                                               String sortDir);

    PagingResponse<OrderDTO> getOrdersByUser(Account user,
            OrderStatus status,
            String keyword,
            Integer pageNo,
            Integer pageSize);

    ReceiptDTO getReceipt(Long id);

    ReceiptDetailDTO getReceiptDetail(Long id,
            Account user);

    OrderDetailDTO getOrderDetail(Long id,
                                  Account user);

    StatDTO getAnalytics(Account user,
            Long shopId);

    CalculateDTO calculate(CalculateRequest request, Account user);

    ReceiptDTO checkout(OrderRequest checkRequest,
            HttpServletRequest request,
            Account user);

    PaymentInfo createPaymentLink(HttpServletRequest request,
            Long id);

    PaymentLinkData getPaymentLinkData(Long id);

    void cancel(Long id,
            String reason,
            Account user);

    void cancelUnpaidOrder(Long orderId,
            String reason,
            Account user);

    void changePaymentMethod(Long orderId,
            PaymentType paymentMethod,
            Account user);

    void refund(Long id,
            String reason,
            Account user);

    void confirm(Long id,
            Account user);

    void confirmPayment(Long id);

    void changeStatus(Long id,
            OrderStatus status,
            Account user);

    List<ChartDTO> getMonthlySales(Account user, Long shopId, Integer year);
}
