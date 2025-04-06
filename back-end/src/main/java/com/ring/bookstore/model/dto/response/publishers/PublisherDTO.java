package com.ring.bookstore.model.dto.response.publishers;

public record PublisherDTO(Integer id,
                           String name,
                           String image) {
    public PublisherDTO(Integer id, String name) {
        this(id, name, null);
    }
}
