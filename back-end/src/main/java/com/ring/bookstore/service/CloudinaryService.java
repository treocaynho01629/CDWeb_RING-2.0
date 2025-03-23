package com.ring.bookstore.service;

import com.ring.bookstore.response.CloudinaryResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface CloudinaryService {

    CloudinaryResponse upload(MultipartFile file, String name, String folderName);
    void destroy(String publicId);
}
