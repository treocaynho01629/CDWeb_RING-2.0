package com.ring.bookstore.dtos.mappers;

import java.util.function.Function;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ring.bookstore.dtos.OrderDetailDTO;
import com.ring.bookstore.model.Book;
import com.ring.bookstore.model.OrderDetail;

@Service
public class OrderDetailMapper implements Function<OrderDetail, OrderDetailDTO> {
    @Override
    public OrderDetailDTO apply(OrderDetail detail) {
    	
    	Book book = detail.getBook();

		String fileDownloadUri = ServletUriComponentsBuilder
					.fromCurrentContextPath()
					.path("/api/images/")
					.path(book.getImages().getName())
					.toUriString();

        return new OrderDetailDTO(detail.getId(),
				detail.getBook().getUser().getUsername(),
				detail.getAmount(),
        		detail.getPrice(),
        		detail.getBook().getId(),
				detail.getStatus(),
        		fileDownloadUri,
        		book.getTitle());
    }
}
