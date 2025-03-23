package com.ring.bookstore.service.impl;

import com.cloudinary.Cloudinary;
import com.ring.bookstore.exception.ImageUploadException;
import com.ring.bookstore.response.CloudinaryResponse;
import com.ring.bookstore.service.CloudinaryService;
import com.ring.bookstore.ultils.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryResponse upload(MultipartFile file, String name, String folderName) {
        FileUploadUtil.assertAllowed(file, FileUploadUtil.IMAGE_PATTERN);

        try {
            HashMap<Object, Object> options = new HashMap<>();
            options.put("public_id", name);
            options.put("folder", folderName);
            Map uploaded = cloudinary.uploader().upload(file.getBytes(), options);
            String publicId = (String) uploaded.get("public_id");
            return CloudinaryResponse.builder()
                    .publicId(publicId)
                    .url(cloudinary.url().secure(true).generate(publicId))
                    .build();
        } catch (IOException e) {
            throw new ImageUploadException("Upload image failed!", e);
        }
    }

    public void destroy(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, new HashMap<>());
        } catch (IOException e) {
            throw new ImageUploadException("Upload image failed!", e);
        }
    }
}
