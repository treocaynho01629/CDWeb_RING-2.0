package com.ring.bookstore.controller;

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

//    //Get all images
//    @GetMapping
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<?> getAllImages() {
//        return new ResponseEntity<>(imageService.getAllImages(), HttpStatus.OK);
//    }

    //Upload image
    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('CREATE_PRIVILEGE')")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file,
                                         @RequestParam(value = "folder", required = false) String folder) {
        Image result = imageService.upload(file, folder);
        return new ResponseEntity<>(result.getUrl(), HttpStatus.OK);
    }

    //Upload multiples images
    @PostMapping("/upload-multiples")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('CREATE_PRIVILEGE')")
    public ResponseEntity<?> uploadImages(@RequestParam("images") MultipartFile[] files,
                                          @RequestParam(value = "folder", required = false) String folder) {
        List<String> messages = new ArrayList<>();

        imageService.uploadMultiple(Arrays.asList(files), folder).forEach(image -> {
            messages.add(image.getName() + " uploaded!");
        });

        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

//    //Upload image
//    @PutMapping("/replace")
//    @PreAuthorize("hasRole('ADMIN') and hasAuthority('UPDATE_PRIVILEGE')")
//    public ResponseEntity<?> replaceImage(@RequestParam("image") MultipartFile file) {
//        if (file.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File not found!");
//        }
//
//        try {
//            ImageDTO image = imageService.replaceAndMap(file);
//            return new ResponseEntity<>(image, HttpStatus.OK);
//        } catch (Exception e) {
//            String message = "Could not upload the file: " + file.getOriginalFilename() + "!";
//            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(message);
//        }
//    }
//
//    //Upload multiples images
//    @PutMapping("/replace-multiples")
//    @PreAuthorize("hasRole('ADMIN') and hasAuthority('UPDATE_PRIVILEGE')")
//    public ResponseEntity<?> replaceImages(@RequestParam("images") MultipartFile[] files) {
//        List<String> messages = new ArrayList<>();
//
//        Arrays.asList(files).forEach(file -> {
//            try {
//                imageService.replace(file);
//                messages.add(file.getOriginalFilename() + " [Successful]");
//            } catch (Exception e) {
//                messages.add(file.getOriginalFilename() + " <Failed> - " + e.getMessage());
//            }
//        });
//
//        return new ResponseEntity<>(messages, HttpStatus.OK);
//    }
//
//    //Get image by {name}
//    @GetMapping("/{name}")
//    @Cacheable("images") REMOVE THIS
//    public ResponseEntity<?> getImage(@PathVariable String name,
//                                      @RequestParam(value = "size", defaultValue = "original") String predefinedTypeName) throws ImageResizerException {
//        Image image = imageService.resolve(predefinedTypeName, name);
//        return ResponseEntity.status(HttpStatus.OK)
//                .contentType(MediaType.valueOf(image.getType()))
//                .cacheControl(CacheControl.maxAge(2592000, TimeUnit.SECONDS))
//                .body(image.getImage()); //Return image
//    }

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

//    //Delete images
//    @DeleteMapping("/delete-multiples")
//    @PreAuthorize("hasRole('ADMIN') and hasAuthority('DELETE_PRIVILEGE')")
//    public ResponseEntity<?> deleteImages(@RequestParam("ids") List<Long> ids) {
//        imageService.deleteImages(ids);
//        return new ResponseEntity<>("Images deleted successfully!", HttpStatus.OK);
//    }
}
