package com.ring.bookstore.service;

import java.util.List;

import com.ring.bookstore.dtos.dashboard.StatDTO;
import com.ring.bookstore.dtos.orders.*;
import com.ring.bookstore.dtos.dashboard.ChartDTO;
import com.ring.bookstore.enums.OrderStatus;
import com.ring.bookstore.request.CalculateRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;

import com.ring.bookstore.model.Account;
import com.ring.bookstore.request.OrderRequest;

public interface OrderService {

    Page<ReceiptDTO> getAllReceipts(Account user,
                                    Long shopId,
                                    OrderStatus status,
                                    String keyword,
                                    Integer pageNo,
                                    Integer pageSize,
                                    String sortBy,
                                    String sortDir);

    Page<ReceiptSummaryDTO> getSummariesWithFilter(Account user,
                                                   Long shopId,
                                                   Long bookId,
                                                   Integer pageNo,
                                                   Integer pageSize,
                                                   String sortBy,
                                                   String sortDir);

    Page<OrderDTO> getOrdersByBookId(Long id,
                                     Integer pageNo,
                                     Integer pageSize,
                                     String sortBy,
                                     String sortDir);

    Page<OrderDTO> getOrdersByUser(Account user,
                                   OrderStatus status,
                                   String keyword,
                                   Integer pageNo,
                                   Integer pageSize);

    ReceiptDTO getReceipt(Long id);

    OrderDetailDTO getOrderDetail(Long id,
                                  Account user);

    StatDTO getAnalytics(Account user,
                         Long shopId);

    CalculateDTO calculate(CalculateRequest request, Account user);

    ReceiptDTO checkout(OrderRequest checkRequest,
                        HttpServletRequest request,
                        Account user);

    void cancel(Long id,
                String reason,
                Account user);

    void refund(Long id,
                String reason,
                Account user);

    void confirm(Long id,
                 Account user);

    void changeStatus(Long id,
                      OrderStatus status,
                      Account user);

    List<ChartDTO> getMonthlySales(Account user, Long shopId, Integer year);
}
