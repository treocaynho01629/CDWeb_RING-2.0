package com.ring.bookstore.service;

import com.ring.bookstore.exception.ImageResizerException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ring.bookstore.dtos.ImageDTO;
import com.ring.bookstore.model.Image;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.List;

@Service
public interface ImageService {

    Image get(String name);

    ImageDTO deleteImage(Integer id);

    boolean existsImage(String name);

    List<ImageDTO> getAllImages();

    ImageDTO upload(MultipartFile file) throws ImageResizerException, IOException;

    ImageDTO replace(MultipartFile file) throws ImageResizerException, IOException;

    Image save(BufferedImage bufferedImage, String fileName, String contentType) throws ImageResizerException;

    Image resolve(String type, String reference) throws ImageResizerException;

    Image resizeAndSave(String reference, String type) throws ImageResizerException;
}
