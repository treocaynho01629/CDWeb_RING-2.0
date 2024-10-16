package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.PublisherDTO;
import com.ring.bookstore.dtos.projections.IPublisher;
import com.ring.bookstore.model.Publisher;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.function.Function;

@Service
public class PublisherMapper implements Function<IPublisher, PublisherDTO> {
	
    @Override
    public PublisherDTO apply(IPublisher projection) {
		Publisher publisher = projection.getPublisher();

        String fileDownloadUri = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/images/")
                .path(projection.getImage())
                .toUriString();

        return new PublisherDTO(publisher.getId()
				, publisher.getPubName()
        		, fileDownloadUri);
    }
}
