package com.ring.bookstore.service;

import com.cloudinary.api.ApiResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ring.bookstore.model.entity.Image;

import java.util.List;

@Service
public interface ImageService {

    List<Image> getAllImages();

    Image replace(MultipartFile file, Long id);

    Image upload(MultipartFile file, String folderName);

    List<Image> uploadMultiple(List<MultipartFile> files, String folderName);

    String deleteImage(String publicId);

    String deleteImage(Long id);

    ApiResponse deleteImages(List<String> publicIds);

    ApiResponse deleteImagesByIds(List<Long> ids);
}
