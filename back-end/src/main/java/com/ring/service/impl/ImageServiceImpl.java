package com.ring.service.impl;

import com.cloudinary.api.ApiResponse;
import com.ring.dto.response.CloudinaryResponse;
import com.ring.exception.HttpResponseException;
import com.ring.exception.ImageUploadException;
import com.ring.exception.ResourceNotFoundException;
import com.ring.model.entity.Image;
import com.ring.repository.ImageRepository;
import com.ring.service.CloudinaryService;
import com.ring.service.ImageService;
import com.ring.utils.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepo;
    private final CloudinaryService cloudinaryService;

    //Get all images
    public List<Image> getAllImages() {
        return imageRepo.findAll();
    }

    @Override
    public Image replace(MultipartFile file, Long id) {
        FileUploadUtil.assertAllowed(file, FileUploadUtil.IMAGE_PATTERN);

        try {
            if (file.isEmpty()) {
                throw new HttpResponseException(HttpStatus.BAD_REQUEST, "File not found!");
            }
            Image image = imageRepo.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Image not found!",
                            "Không tim thấy hình ảnh yêu cầu!"));

            BufferedImage imageBuffer = ImageIO.read(file.getInputStream());
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(imageBuffer, file.getContentType().split("/")[1], baos);
            byte[] bytes = baos.toByteArray();

            CloudinaryResponse uploaded = cloudinaryService.replace(bytes, image.getPublicId());
            image.setPublicId(uploaded.getPublicId());
            image.setUrl(uploaded.getUrl());
            if (uploaded.getUrl() == null) {
                throw new ImageUploadException("Image failed to replace!");
            }
            return image;
        } catch (Exception e) {
            throw new ImageUploadException("Image failed to replace!", e);
        }
    }

    @Override
    public Image upload(MultipartFile file, String folderName) {
        FileUploadUtil.assertAllowed(file, FileUploadUtil.IMAGE_PATTERN);
        String fileName = FileUploadUtil.getFileName(file);

        try {
            if (file.isEmpty()) {
                throw new HttpResponseException(HttpStatus.BAD_REQUEST, "File not found!");
            }

            BufferedImage imageBuffer = ImageIO.read(file.getInputStream());
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(imageBuffer, file.getContentType().split("/")[1], baos);
            byte[] bytes = baos.toByteArray();

            CloudinaryResponse uploaded = cloudinaryService.upload(bytes, FilenameUtils.getBaseName(fileName), folderName);
            Image image = Image.builder()
                    .name(fileName)
                    .publicId(uploaded.getPublicId())
                    .url(uploaded.getUrl())
                    .type(file.getContentType())
                    .build();
            if (image.getUrl() == null) {
                throw new ImageUploadException("Image failed to upload!");
            }
            Image savedImage = imageRepo.save(image);
            return savedImage;
        } catch (Exception e) {
            throw new ImageUploadException("Image failed to upload!", e);
        }
    }

    @Async
    protected CompletableFuture<Image> uploadAsync(MultipartFile file, String folderName) {
        return CompletableFuture.completedFuture(upload(file, folderName));
    }

    public List<Image> uploadMultiple(List<MultipartFile> files, String folderName) {
        List<CompletableFuture<Image>> futures = new ArrayList<>();
        for (MultipartFile file : files) {
            CompletableFuture<Image> future = uploadAsync(file, folderName);
            futures.add(future);
        }

        // Wait for all futures to complete and gather the results
        CompletableFuture<Void> allUploads = CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]));

        return allUploads.thenApply(v -> futures.stream()
                        .map(CompletableFuture::join) // Join each future to get the result
                        .filter(Objects::nonNull) // Filter out any failed uploads
                        .collect(Collectors.toList()))
                .join();
    }

    public String deleteImage(String publicId) {
        cloudinaryService.destroy(publicId);
        return "Delete image " + publicId + " succesfully!";
    }

    public String deleteImage(Long id) {
        Image image = imageRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found!",
                        "Không tim thấy hình ảnh yêu cầu!"));
        return deleteImage(image.getPublicId());
    }

    public ApiResponse deleteImages(List<String> publicIds) {
        return cloudinaryService.destroyMultiple(publicIds);
    }

    public ApiResponse deleteImagesByIds(List<Long> ids) {
        List<String> publicIds = imageRepo.findPublicIds(ids);
        return cloudinaryService.destroyMultiple(publicIds);
    }
}
