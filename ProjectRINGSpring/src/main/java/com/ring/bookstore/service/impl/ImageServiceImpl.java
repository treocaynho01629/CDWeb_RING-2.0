package com.ring.bookstore.service.impl;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.ring.bookstore.dtos.ImageDTO;
import com.ring.bookstore.dtos.mappers.ImageMapper;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Image;
import com.ring.bookstore.repository.ImageRepository;
import com.ring.bookstore.service.ImageService;

import java.io.IOException;
import java.util.stream.Stream;


@RequiredArgsConstructor
@Service
public class ImageServiceImpl implements ImageService {
	
	private final ImageRepository imageRepo;
	
	@Autowired
	private ImageMapper imageMapper;
	
	public ImageDTO uploadImage(MultipartFile file) throws IOException {
		
		String fileName = StringUtils.cleanPath(file.getOriginalFilename());
	    var image = Image.builder()
	    		.name(fileName)
	    		.type(file.getContentType())
	    		.image(file.getBytes())
				.build();
	    		
	    Image savedImage = imageRepo.save(image);
	    ImageDTO dto = imageMapper.apply(savedImage);
	    return dto;
	}

	public Image getImage(String name) {
		Image image = imageRepo.findByName(name).orElseThrow(() -> 
			new ResourceNotFoundException("Image does not exists!"));
		return image;
	}

	public Stream<Image> getAllImages() {
		return imageRepo.findAll().stream();
	}
	

}
