package com.ring.bookstore.model.mappers;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.ring.bookstore.model.dto.response.publishers.PublisherDTO;
import com.ring.bookstore.model.entity.Image;
import com.ring.bookstore.model.entity.Publisher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@RequiredArgsConstructor
@Service
public class PublisherMapper implements Function<Publisher, PublisherDTO> {

    private final Cloudinary cloudinary;

    @Override
    public PublisherDTO apply(Publisher publisher) {
        Image image = publisher.getImage();
        String url = cloudinary.url().transformation(new Transformation()
                        .aspectRatio("1.0")
                        .width(100)
                        .quality("auto")
                        .fetchFormat("auto"))
                        .secure(true).generate(image.getPublicId());

        return new PublisherDTO(publisher.getId()
				, publisher.getName()
        		, url);
    }
}
