package com.ring.dto.response.publishers;

/**
 * Represents a publisher response as {@link PublisherDTO}.
 */
public record PublisherDTO(Integer id,
                           String name,
                           String image) {

    public PublisherDTO(Integer id,
                        String name) {
        this(id, name, null);
    }
}
