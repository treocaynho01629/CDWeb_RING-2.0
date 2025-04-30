package com.ring.bookstore.service;

import com.cloudinary.api.ApiResponse;
import com.ring.bookstore.model.dto.response.CloudinaryResponse;

import java.util.List;

public interface CloudinaryService {

    CloudinaryResponse replace(byte[] data, String publicId);

    CloudinaryResponse upload(byte[] data, String name, String folderName);

    void destroy(String publicId);

    ApiResponse destroyMultiple(List<String> publicIds);
}
