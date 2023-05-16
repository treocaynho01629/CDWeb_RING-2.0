package com.ring.bookstore.service.impl;

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

	//Tải ảnh
	public ImageDTO uploadImage(MultipartFile file) throws IOException {

		//Kiểm tra file
		String fileName = StringUtils.cleanPath(file.getOriginalFilename());
		
		//Kiểm tra ảnh tồn tại?
		Image image = imageRepo.findByName(fileName).orElse(
				Image.builder()
				.name(fileName)
				.type(file.getContentType())
				.image(file.getBytes())
				.build());
		imageRepo.save(image);
		ImageDTO dto = imageMapper.apply(image);
		return dto;
	}

	//Trả ảnh
	public Image getImage(String name) {
		Image image = imageRepo.findByName(name)
				.orElseThrow(() -> new ResourceNotFoundException("Image does not exists!"));
		return image;
	}

	public List<ImageDTO> getAllImages() {
        List<Image> imagesList = imageRepo.findAll();
        List<ImageDTO> imageDtos = imagesList.stream().map(imageMapper::apply).collect(Collectors.toList());
		return imageDtos;
	}

	@Override
	public ImageDTO deleteImage(Integer id) {
		Image image = imageRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Image does not exists!"));
		imageRepo.deleteById(id);
		
		ImageDTO dto = imageMapper.apply(image);
		return dto;
	}

	public boolean existsImage(String name) {
		return imageRepo.existsByName(name);
	}

}
