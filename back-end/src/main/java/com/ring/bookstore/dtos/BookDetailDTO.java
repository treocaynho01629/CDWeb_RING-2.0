package com.ring.bookstore.dtos;

import java.time.LocalDate;
import java.util.List;

import com.ring.bookstore.model.Publisher;

//Book details
public record BookDetailDTO(Integer id,
                            List<String> images,
                            Double price,
                            String title,
                            String description,
                            String type,
                            String author,
                            String sellerName,
                            Publisher publisher,
                            Integer cateId,
                            String cateName,
                            String size,
                            Integer page,
                            LocalDate date,
                            String language,
                            Double weight,
                            Integer amount,
                            Integer rateTotal,
                            Integer rateAmount,
                            Integer orderTime) {

}
