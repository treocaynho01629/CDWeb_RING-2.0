package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.images.ImageInfoDTO;
import com.ring.bookstore.dtos.images.IImageInfo;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.ring.bookstore.dtos.images.ImageDTO;
import com.ring.bookstore.model.Image;

@Service
public class ImageMapper {

    public ImageDTO imageToDTO(Image image) {

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

	public ImageInfoDTO infoToDTO(IImageInfo image) {

		String fileDownloadUri = ServletUriComponentsBuilder
				.fromCurrentContextPath()
				.path("/api/images/")
				.path(image.getName())
				.toUriString();

		return new ImageInfoDTO(image.getId(),
				image.getName(),
				fileDownloadUri,
				image.getType());
	}
}
