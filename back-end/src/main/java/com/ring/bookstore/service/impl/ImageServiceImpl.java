package com.ring.bookstore.service.impl;

import com.ring.bookstore.dtos.ImageInfoDTO;
import com.ring.bookstore.dtos.projections.IImageInfo;
import com.ring.bookstore.enums.ImageSize;
import com.ring.bookstore.exception.ImageResizerException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.imgscalr.Scalr;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.ring.bookstore.dtos.ImageDTO;
import com.ring.bookstore.dtos.mappers.ImageMapper;
import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Image;
import com.ring.bookstore.repository.ImageRepository;
import com.ring.bookstore.service.ImageService;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ImageServiceImpl implements ImageService {

    @Value("${image.size.small}")
    private Integer smallSize;

    @Value("${image.size.medium}")
    private Integer medSize;

    private final ImageRepository imageRepo;
    private final ImageMapper imageMapper;

    //Map to DTO instead
    public ImageDTO uploadAndMap(MultipartFile file) throws ImageResizerException, IOException {
        Image savedImage = upload(file);
        ImageDTO dto = imageMapper.imageToDTO(savedImage); //Map to DTO
        return dto;
    }

    public ImageDTO replaceAndMap(MultipartFile file) throws ImageResizerException, IOException {
        Image savedImage = replace(file);
        ImageDTO dto = imageMapper.imageToDTO(savedImage); //Map to DTO
        return dto;
    }

    //Upload to Database
    public Image upload(MultipartFile file) throws ImageResizerException, IOException {
        //File name & data
        String fileName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(file.getOriginalFilename()); //With timestamp
        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        //Compress image
        BufferedImage compressImage = Scalr.resize(originalImage,
                Scalr.Method.BALANCED,
                Scalr.Mode.AUTOMATIC, //Keep dimension
                originalImage.getWidth()); //Keep original size

        Image savedImage = save(compressImage, fileName, file.getContentType());
        return savedImage;
    }

    //Replace on Database
    public Image replace(MultipartFile file) throws ImageResizerException, IOException {
        //File name & data
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        //Compress image
        BufferedImage compressImage = Scalr.resize(originalImage,
                Scalr.Method.BALANCED,
                Scalr.Mode.AUTOMATIC, //Keep dimension
                originalImage.getWidth()); //Keep original size

        Image savedImage = save(compressImage, fileName, file.getContentType());
        return savedImage;
    }

    //Get all images
    public List<ImageInfoDTO> getAllImages() {
        List<IImageInfo> imagesList = imageRepo.findAllWithoutData();
        List<ImageInfoDTO> imageDtos = imagesList.stream().map(imageMapper::infoToDTO).collect(Collectors.toList()); //Map to DTO
        return imageDtos;
    }

    //Delete image by {id}
    @Transactional
    public String deleteImage(Integer id) {
        Image image = imageRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Image does not exists!"));
        imageRepo.deleteById(id);

        return "Delete image " + image.getImage() + " successfully!";
    }

    //Check if image with {name} already exists
    public boolean existsImage(String name) {
        return imageRepo.existsByName(name);
    }

    //Get image by {name}
    public Image get(String name) {
        Image image = imageRepo.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Image does not exists!"));
        return image;
    }

    //Save image to database
    @Transactional
    public Image save(BufferedImage bufferedImage, String fileName, String contentType) throws ImageResizerException {
        try {
            Image image = imageRepo.findByName(fileName).orElse( //Create image row if not already exists
                    Image.builder()
                            .name(fileName)
                            .type(contentType)
                            .image(null)
                            .build());

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(bufferedImage, contentType.split("/")[1], baos);
            byte[] bytes = baos.toByteArray();

            image.setImage(bytes); //Set image data
            imageRepo.save(image); //Save to database
            return image;
        } catch (IOException e) {
            throw new ImageResizerException(HttpStatus.INTERNAL_SERVER_ERROR, "Resized image could not be saved.");
        }
    }
    //Get image with {reference (name)} and {type (size)}
    public Image resolve(String type, String reference) throws ImageResizerException {
        if (!type.equalsIgnoreCase(ImageSize.ORIGINAL.toString())) {
            try {
                // Get image from database if it is already resized.
                return get(getResizedFileName(reference, type));
            } catch (ResourceNotFoundException exception) {
                // Resize image, store it and return it.
                return resizeAndSave(reference, type);
            }
        } else {
            try {
                // Return original.
                return get(reference);
            } catch (ResourceNotFoundException exception) {
                throw new ImageResizerException(HttpStatus.NOT_FOUND, "The original image could not be found.");
            }
        }
    }

    @Transactional
    public Image resizeAndSave(String reference, String type) throws ImageResizerException {
        try {
            Image image = get(reference); //Get original image
            BufferedImage resizedBi = getResizedImage(image.getImage(), type); //Resize it

            Image resizedImage = save(resizedBi, getResizedFileName(reference, type), image.getType()); //Store in database

            //Set parent image for cascade
            resizedImage.setParent(image);
            imageRepo.save(resizedImage);

            return resizedImage;
        } catch (ResourceNotFoundException exception) {
            throw new ImageResizerException(HttpStatus.NOT_FOUND, "The original image could not be found.");
        }
    }

    private BufferedImage resize(BufferedImage bufferedImage, String type) throws ImageResizerException {
        Integer size = -1; //Get resize size base on type
        if (type.equalsIgnoreCase(ImageSize.SMALL.toString())) {
            size = smallSize;
        } else if (type.equalsIgnoreCase(ImageSize.MEDIUM.toString())) {
            size = medSize;
        } else {
            throw new ImageResizerException(HttpStatus.INTERNAL_SERVER_ERROR, "Configuration is not available: " + type);
        }

        try {
            return Scalr.resize(bufferedImage,
                    Scalr.Method.BALANCED,
                    Scalr.Mode.AUTOMATIC,
                    size); // Size base on type
        } catch (Exception e) {
            throw new ImageResizerException(HttpStatus.INTERNAL_SERVER_ERROR, "Image could not be resized to type: " + e.getMessage());
        }
    }

    private BufferedImage getResizedImage(byte[] data, String type) throws ImageResizerException {
        try {
            // Convert byte[] back to a BufferedImage
            InputStream is = new ByteArrayInputStream(data);
            BufferedImage bufferedImage = ImageIO.read(is);

            BufferedImage resizedImage = resize(bufferedImage, type);
            return resizedImage;
        } catch (IOException e) {
            throw new ImageResizerException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not read the original image.");
        }
    }

    private String getResizedFileName(String reference, String type) {
        return type + "_" + reference;
    }
}
