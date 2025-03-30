package com.ring.bookstore.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.api.ApiResponse;
import com.ring.bookstore.exception.ImageUploadException;
import com.ring.bookstore.response.CloudinaryResponse;
import com.ring.bookstore.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryResponse replace(byte[] data, String publicId) {
        try {
            HashMap<Object, Object> options = new HashMap<>();
            options.put("public_id", publicId);
            options.put("invalidated", true);

            cloudinary.uploader().upload(data, options);
            return CloudinaryResponse.builder()
                    .publicId(publicId)
                    .url(cloudinary.url().secure(true).generate(publicId))
                    .build();
        } catch (IOException e) {
            throw new ImageUploadException("Replace image failed!", e);
        }
    }

    public CloudinaryResponse upload(byte[] data, String name, String folderName) {
        try {
            HashMap<Object, Object> options = new HashMap<>();
            options.put("public_id", name);
            options.put("folder", folderName);
            Map uploaded = cloudinary.uploader().upload(data, options);
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
            HashMap<Object, Object> options = new HashMap<>();
            options.put("invalidated", true);
            cloudinary.uploader().destroy(publicId, options);
        } catch (Exception e) {
            throw new ImageUploadException("Delete image failed!", e);
        }
    }

    public ApiResponse destroyMultiple(List<String> publicIds) {
        try {
            HashMap<Object, Object> options = new HashMap<>();
            options.put("invalidated", true);
            return cloudinary.api().deleteResources(publicIds, options);
        } catch (Exception e) {
            throw new ImageUploadException("Delete images failed!", e);
        }
    }
}
