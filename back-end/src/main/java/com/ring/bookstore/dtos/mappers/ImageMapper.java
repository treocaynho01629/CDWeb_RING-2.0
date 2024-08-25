package com.ring.bookstore.dtos.mappers;

import java.util.function.Function;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ring.bookstore.dtos.ImageDTO;
import com.ring.bookstore.model.Image;

@Service
public class ImageMapper implements Function<Image, ImageDTO> {
	
	
    @Override
    public ImageDTO apply(Image image) {

		String fileDownloadUri = ServletUriComponentsBuilder
					.fromCurrentContextPath()
					.path("/api/images/")
					.path(image.getName())
					.toUriString();

        return new ImageDTO(image.getName()
        		,fileDownloadUri
        		,image.getType()
        		,image.getImage().length);
    }
}
