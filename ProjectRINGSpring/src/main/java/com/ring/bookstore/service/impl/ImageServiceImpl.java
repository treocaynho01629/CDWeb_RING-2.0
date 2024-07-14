package com.ring.bookstore.service.impl;

import com.ring.bookstore.utils.ImageUtils;
import jakarta.transaction.Transactional;
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
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ImageServiceImpl implements ImageService {

	@Autowired
	private ImageRepository imageRepo;

	@Autowired
	private ImageMapper imageMapper;

	//Upload to Database
	public ImageDTO uploadImage(MultipartFile file) throws IOException {

		//File validation
		String fileName = StringUtils.cleanPath(file.getOriginalFilename());
		
		Image image = imageRepo.findByName(fileName).orElse( //Create image if not already exists
				Image.builder()
				.name(fileName)
				.type(file.getContentType())
				.image(null)
				.build());

		image.setImage(ImageUtils.compressImage(file.getBytes())); //Compress and set image
		imageRepo.save(image); //Save to database
		ImageDTO dto = imageMapper.apply(image); //Map to DTO
		return dto;
	}

	//Get image by {name}
	public Image getImage(String name) {
		Image image = imageRepo.findByName(name)
				.orElseThrow(() -> new ResourceNotFoundException("Image does not exists!"));
		return image;
	}

	//Get all images
	public List<ImageDTO> getAllImages() {
        List<Image> imagesList = imageRepo.findAll();
        List<ImageDTO> imageDtos = imagesList.stream().map(imageMapper::apply).collect(Collectors.toList()); //Map to DTO
		return imageDtos;
	}

	//Delete image by {id}
	@Override
	@Transactional
	public ImageDTO deleteImage(Integer id) {
		Image image = imageRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Image does not exists!"));
		imageRepo.deleteById(id);
		
		ImageDTO dto = imageMapper.apply(image); //Map to DTO
		return dto;
	}

	//Check if image with {name} already exists
	public boolean existsImage(String name) {
		return imageRepo.existsByName(name);
	}

}
