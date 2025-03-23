package com.ring.bookstore.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ring.bookstore.model.Image;

@Service
public interface ImageService {

//    List<ImageInfoDTO> getAllImages();
//
//    Image replace(MultipartFile file) throws ImageResizerException, IOException;
//
//    ImageDTO uploadAndMap(MultipartFile file) throws ImageResizerException, IOException;
//
//    ImageDTO replaceAndMap(MultipartFile file) throws ImageResizerException, IOException;
//
//    Image save(BufferedImage bufferedImage,
//               String fileName,
//               String contentType) throws ImageResizerException;
//
//    Image resolve(String type,
//                  String reference) throws ImageResizerException;
//
//    Image resizeAndSave(String reference,
//                        String type) throws ImageResizerException;
//
//    String deleteImage(Long id);
//
//    void deleteImages(List<Long> ids);

    Image upload(MultipartFile file, String folderName);

    String deleteImage(String publicId);

    String deleteImage(Long id);
}
