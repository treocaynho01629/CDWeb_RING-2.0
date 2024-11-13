package com.ring.bookstore.dtos.mappers;

import java.util.List;
import java.util.stream.Collectors;

import com.ring.bookstore.dtos.orders.OrderDetailDTO;
import com.ring.bookstore.dtos.orders.OrderItemDTO;
import com.ring.bookstore.model.*;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.orders.ReceiptDTO;
import com.ring.bookstore.dtos.orders.OrderDTO;

@Service
public class OrderMapper {

    public ReceiptDTO orderToOrderDTO(OrderReceipt order) {
        List<OrderDetail> orderDetails = order.getDetails();
        List<OrderDTO> detailDTOS = orderDetails.stream().map(this::detailToDetailDTO).collect(Collectors.toList());
        Account user = order.getUser();

        //If user deleted
        String username = "Người dùng RING!";
        if (user != null) username = user.getUsername();

        return new ReceiptDTO(order.getId(),
                order.getFullName(),
                order.getEmail(),
                order.getPhone(),
                order.getOrderAddress(),
                order.getOrderMessage(),
                order.getOrderDate(),
                order.getTotal(),
                order.getTotalDiscount(),
                username,
                detailDTOS
        );
    }

    public OrderDTO detailToDetailDTO(OrderDetail detail) {
        List<OrderItem> orderItems = detail.getItems();
        List<OrderItemDTO> itemDTOS = orderItems.stream().map(this::itemToItemDTO).collect(Collectors.toList());
        Shop shop = detail.getShop();

        return new OrderDTO(detail.getId(),
                shop.getId(),
                shop.getName(),
                detail.getTotalPrice(),
                detail.getDiscount(),
                detail.getShippingFee(),
                detail.getShippingDiscount(),
                detail.getStatus(),
                itemDTOS);
    }

    public OrderItemDTO itemToItemDTO(OrderItem item) {
        Book book = item.getBook();
        String fileDownloadUri = book.getImage().getFileDownloadUri();

        return new OrderItemDTO(item.getId(),
                item.getPrice(),
                item.getDiscount(),
                item.getQuantity(),
                book.getId(),
                book.getSlug(),
                fileDownloadUri,
                book.getTitle());
    }

    public OrderDetailDTO orderToDetailDTO(OrderDetail detail) {
        List<OrderItem> orderItems = detail.getItems();
        List<OrderItemDTO> itemDTOS = orderItems.stream().map(this::itemToItemDTO).collect(Collectors.toList());
        OrderReceipt order = detail.getOrder();
        Shop shop = detail.getShop();

        return new OrderDetailDTO(order.getId(),
                order.getFullName(),
                order.getEmail(),
                order.getPhone(),
                order.getOrderAddress(),
                order.getOrderMessage(),
                order.getOrderDate(),
                detail.getId(),
                shop.getId(),
                shop.getName(),
                detail.getTotalPrice(),
                detail.getDiscount(),
                detail.getShippingFee(),
                detail.getShippingDiscount(),
                itemDTOS);
    }
}
