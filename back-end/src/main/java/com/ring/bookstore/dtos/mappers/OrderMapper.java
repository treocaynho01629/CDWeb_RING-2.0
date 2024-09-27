package com.ring.bookstore.dtos.mappers;

import java.util.List;
import java.util.stream.Collectors;

import com.ring.bookstore.dtos.OrderItemDTO;
import com.ring.bookstore.model.*;
import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.OrderDTO;
import com.ring.bookstore.dtos.OrderDetailDTO;

@Service
public class OrderMapper {

    public OrderDTO orderToOrderDTO(OrderReceipt order) {
        List<OrderDetail> orderDetails = order.getDetails();
        List<OrderDetailDTO> detailDTOS = orderDetails.stream().map(this::detailToDetailDTO).collect(Collectors.toList());
        Account user = order.getUser();

        //If user deleted
        String username = "Người dùng RING!";
        if (user != null) username = user.getUsername();

        return new OrderDTO(order.getId(),
                order.getFullName(),
                order.getEmail(),
                order.getPhone(),
                order.getOrderAddress(),
                order.getOrderMessage(),
                order.getOrderDate(),
                order.getTotal(),
                username,
                detailDTOS
        );
    }

    public OrderDetailDTO detailToDetailDTO(OrderDetail detail) {
        List<OrderItem> orderItems = detail.getItems();
        List<OrderItemDTO> itemDTOS = orderItems.stream().map(this::itemToItemDTO).collect(Collectors.toList());
        Shop shop = detail.getShop();

        return new OrderDetailDTO(detail.getId(),
                shop.getId(),
                shop.getName(),
                detail.getTotalPrice(),
                detail.getStatus(),
                itemDTOS);
    }

    public OrderItemDTO itemToItemDTO(OrderItem item) {
        Book book = item.getBook();
        String fileDownloadUri = book.getImage().getFileDownloadUri();

        return new OrderItemDTO(item.getId(),
                item.getPrice(),
                item.getAmount(),
                book.getId(),
                book.getSlug(),
                fileDownloadUri,
                book.getTitle());
    }
}
