package com.ring.bookstore.controller;

import com.cloudinary.api.ApiResponse;
import com.ring.bookstore.exception.HttpResponseException;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.ring.bookstore.model.Image;
import com.ring.bookstore.service.ImageService;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    //Get all images
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllImages() {
        return new ResponseEntity<>(imageService.getAllImages(), HttpStatus.OK);
    }

    //Upload image
    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('CREATE_PRIVILEGE')")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file,
                                         @RequestParam(value = "folder", required = false) String folder) {
        Image result = imageService.upload(file, folder);
        return new ResponseEntity<>(result.getUrl(), HttpStatus.OK);
    }

    //Upload multiples images
    @PostMapping("/upload-multiple")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('CREATE_PRIVILEGE')")
    public ResponseEntity<?> uploadImages(@RequestParam("images") MultipartFile[] files,
                                          @RequestParam(value = "folder", required = false) String folder) {
        List<String> messages = new ArrayList<>();

        imageService.uploadMultiple(Arrays.asList(files), folder).forEach(image -> {
            messages.add(image.getName() + " uploaded!");
        });

        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    //Replace image
    @PutMapping("/replace")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('UPDATE_PRIVILEGE')")
    public ResponseEntity<?> replaceImage(@RequestParam("image") MultipartFile file,
                                          @RequestParam("id") Long id) {
        Image result = imageService.replace(file, id);
        return new ResponseEntity<>(result.getUrl(), HttpStatus.OK);
    }

    //Delete image by {id}
    @DeleteMapping("/delete")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> uploadImage(@RequestParam("id") @NotBlank(message = "Phải bao gồm public id!") String publicId) {
        String result = imageService.deleteImage(publicId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> uploadImage(@PathVariable Long id) {
        String result = imageService.deleteImage(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    //Delete images
    @DeleteMapping("/delete-multiple")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('DELETE_PRIVILEGE')")
    public ResponseEntity<?> deleteImages(@RequestParam(value = "publicIds", required = false) List<String> publicIds,
                                          @RequestParam(value = "ids", required = false) List<Long> ids) {
        if (publicIds.isEmpty() && ids.isEmpty())
            throw new HttpResponseException(HttpStatus.BAD_REQUEST, "Phải bao gồm ids hoặc publicIds");
        ApiResponse response = !publicIds.isEmpty() ? imageService.deleteImages(publicIds)
                : imageService.deleteImagesByIds(ids);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
