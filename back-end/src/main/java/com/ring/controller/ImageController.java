package com.ring.controller;

import com.cloudinary.api.ApiResponse;
import com.ring.exception.HttpResponseException;
import com.ring.model.entity.Image;
import com.ring.service.ImageService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Controller named {@link ImageController} for handling image-related operations.
 * Exposes endpoints under "/api/images".
 */
@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    /**
     * Retrieves all images in the system.
     *
     * @return list of all images.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','GUEST') and hasAuthority('read:user')")
    public ResponseEntity<?> getAllImages() {
        return new ResponseEntity<>(imageService.getAllImages(), HttpStatus.OK);
    }

    /**
     * Uploads a single image.
     *
     * @param file the image file.
     * @param folder optional folder to upload the image into.
     * @return the URL of the uploaded image.
     */
    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('create:image')")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file,
                                         @RequestParam(value = "folder", required = false) String folder) {
        Image result = imageService.upload(file, folder);
        return new ResponseEntity<>(result.getUrl(), HttpStatus.OK);
    }

    /**
     * Uploads multiple images.
     *
     * @param files array of image files.
     * @param folder optional folder to upload the images into.
     * @return list of messages confirming each upload.
     */
    @PostMapping("/upload-multiple")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('create:image')")
    public ResponseEntity<?> uploadImages(@RequestParam("images") MultipartFile[] files,
                                          @RequestParam(value = "folder", required = false) String folder) {
        List<String> messages = new ArrayList<>();

        imageService.uploadMultiple(Arrays.asList(files), folder).forEach(image -> {
            messages.add(image.getName() + " uploaded!");
        });

        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    /**
     * Replaces an existing image with a new file.
     *
     * @param file the new image file.
     * @param id the ID of the image to replace.
     * @return the URL of the new image.
     */
    @PutMapping("/replace")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('update:image')")
    public ResponseEntity<?> replaceImage(@RequestParam("image") MultipartFile file,
                                          @RequestParam("id") Long id) {
        Image result = imageService.replace(file, id);
        return new ResponseEntity<>(result.getUrl(), HttpStatus.OK);
    }

    /**
     * Deletes an image using its public ID.
     *
     * @param publicId the public ID of the image to delete.
     * @return deletion result message.
     */
    @DeleteMapping("/delete")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('delete:image')")
    public ResponseEntity<?> deleteImage(@RequestParam("id") @NotBlank(message = "Phải bao gồm public id!") String publicId) {
        String result = imageService.deleteImage(publicId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * Deletes an image by its database ID.
     *
     * @param id the ID of the image to delete.
     * @return deletion result message.
     */
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('delete:image')")
    public ResponseEntity<?> deleteImage(@PathVariable Long id) {
        String result = imageService.deleteImage(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    /**
     * Deletes multiple images by either public IDs or database IDs.
     * At least one of the two lists must be provided.
     *
     * @param publicIds list of public IDs to delete (optional).
     * @param ids list of database IDs to delete (optional).
     * @return result of the deletion operation.
     */
    @DeleteMapping("/delete-multiple")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('delete:image')")
    public ResponseEntity<?> deleteImages(@RequestParam(value = "publicIds", required = false) List<String> publicIds,
                                          @RequestParam(value = "ids", required = false) List<Long> ids) {
        if (publicIds.isEmpty() && ids.isEmpty())
            throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Phải bao gồm ids hoặc publicIds");
        ApiResponse response = !publicIds.isEmpty() ? imageService.deleteImages(publicIds)
                : imageService.deleteImagesByIds(ids);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
