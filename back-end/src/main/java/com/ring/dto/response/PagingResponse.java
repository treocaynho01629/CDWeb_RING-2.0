package com.ring.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;

@Data
@NoArgsConstructor
public class PagingResponse<T> {

    private Collection<T> content;
    private Integer totalPages;
    private long totalElements;
    private Integer size;
    private Integer page;
    private boolean empty;

    public PagingResponse(Collection<T> content, Integer totalPages, long totalElements, Integer size, Integer page, boolean empty) {
        this.content = content;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.size = size;
        this.page = page;
        this.empty = empty;
    }
}
