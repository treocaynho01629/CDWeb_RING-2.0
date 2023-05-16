package com.ring.bookstore.dtos.mappers;

import java.util.function.Function;

import org.springframework.stereotype.Service;

import com.ring.bookstore.dtos.OrderDetailDTO;
import com.ring.bookstore.model.OrderDetail;

@Service
public class OrderDetailMapper implements Function<OrderDetail, OrderDetailDTO> {
    @Override
    public OrderDetailDTO apply(OrderDetail detail) {
        return new OrderDetailDTO(detail.getAmount(),
        		detail.getPrice(),
        		detail.getBook().getId());
    }
}
