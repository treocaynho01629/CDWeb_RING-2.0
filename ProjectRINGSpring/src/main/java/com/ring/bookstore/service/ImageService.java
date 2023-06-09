package com.ring.bookstore.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ring.bookstore.dtos.ImageDTO;
import com.ring.bookstore.model.Image;

import java.io.IOException;
import java.util.List;

@Service
public interface ImageService {
	
	ImageDTO uploadImage(MultipartFile file) throws IOException;
    Image getImage(String name);
    ImageDTO deleteImage(Integer id);
    boolean existsImage(String name);
    List<ImageDTO> getAllImages();
}
