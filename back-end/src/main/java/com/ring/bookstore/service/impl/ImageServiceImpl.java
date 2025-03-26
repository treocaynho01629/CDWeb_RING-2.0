package com.ring.bookstore.service.impl;

import com.ring.bookstore.dtos.images.ImageInfoDTO;
import com.ring.bookstore.dtos.images.IImageInfo;
import com.ring.bookstore.exception.HttpResponseException;
import com.ring.bookstore.exception.ImageUploadException;
import com.ring.bookstore.response.CloudinaryResponse;
import com.ring.bookstore.service.CloudinaryService;
import com.ring.bookstore.ultils.FileUploadUtil;
import org.apache.commons.io.FilenameUtils;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ring.bookstore.dtos.mappers.ImageMapper;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Image;
import com.ring.bookstore.repository.ImageRepository;
import com.ring.bookstore.service.ImageService;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepo;
    private final ImageMapper imageMapper;
    private final CloudinaryService cloudinaryService;

//    //Map to DTO instead
//    @Transactional
//    public ImageDTO uploadAndMap(MultipartFile file) throws ImageResizerException, IOException {
//        Image savedImage = upload(file);
//        ImageDTO dto = imageMapper.imageToDTO(savedImage); //Map to DTO
//        return dto;
//    }
//
//    @Transactional
//    public ImageDTO replaceAndMap(MultipartFile file) throws ImageResizerException, IOException {
//        Image savedImage = replace(file);
//        ImageDTO dto = imageMapper.imageToDTO(savedImage); //Map to DTO
//        return dto;
//    }

//    //Upload to Database
//    @Transactional
//    public Image upload(MultipartFile file) throws ImageResizerException, IOException {
//        //File name & data
//        String fileName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(file.getOriginalFilename()); //With timestamp
//        BufferedImage originalImage = ImageIO.read(file.getInputStream());
//
//        //Compress image
//        BufferedImage compressImage = Scalr.resize(originalImage,
//                Scalr.Method.BALANCED,
//                Scalr.Mode.AUTOMATIC, //Keep dimension
//                originalImage.getWidth()); //Keep original size
//
//        Image savedImage = this.save(compressImage, fileName, file.getContentType());
//        return savedImage;
//    }
//
//    //Replace on Database
//    @Transactional
//    public Image replace(MultipartFile file) throws ImageResizerException, IOException {
//        //File name & data
//        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
//        BufferedImage originalImage = ImageIO.read(file.getInputStream());
//
//        //Compress image
//        BufferedImage compressImage = Scalr.resize(originalImage,
//                Scalr.Method.BALANCED,
//                Scalr.Mode.AUTOMATIC, //Keep dimension
//                originalImage.getWidth()); //Keep original size
//
//        Image savedImage = this.save(compressImage, fileName, file.getContentType());
//        return savedImage;
//    }

    //Get all images
    public List<ImageInfoDTO> getAllImages() {
        List<IImageInfo> imagesList = imageRepo.findAllInfo();
        List<ImageInfoDTO> imageDTOS = imagesList.stream().map(imageMapper::infoToDTO).collect(Collectors.toList()); //Map to DTO
        return imageDTOS;
    }


    @Override
    public Image upload(MultipartFile file, String folderName) {
        String fileName = FileUploadUtil.getFileName(file);

        try {
            if (file.isEmpty()) {
                throw new HttpResponseException(HttpStatus.BAD_REQUEST, "File not found!");
            }

            CloudinaryResponse uploaded = cloudinaryService.upload(file, FilenameUtils.getBaseName(fileName), folderName);

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
        try {
            cloudinaryService.destroy(publicId);
            return "Delete image " + publicId + " succesfully!";
        } catch (Exception e) {
            throw new ImageUploadException("Delete image failed!", e);
        }
    }

    public String deleteImage(Long id) {
        Image image = imageRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found!"));
        return deleteImage(image.getPublicId());
    }
}
