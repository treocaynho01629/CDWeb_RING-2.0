package com.ring.bookstore.controller;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ring.bookstore.dtos.ImageDTO;
import com.ring.bookstore.model.Image;
import com.ring.bookstore.service.ImageService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {
	
	private final ImageService imageService;
	
	//Lấy tất cả ảnh
	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getAllImages() {
		return new ResponseEntity<>(imageService.getAllImages(), HttpStatus.OK);
	}

	//Tải ảnh lên Server
	@PostMapping("/upload")
	@PreAuthorize("hasAnyRole('ADMIN','SELLER')")
	public ResponseEntity<?> uploadFile(@RequestParam("image") MultipartFile file) throws IOException {
		
		try {
			ImageDTO image = imageService.uploadImage(file);
			return new ResponseEntity<>(image, HttpStatus.OK);
		} catch (Exception e) {
			String message = "Could not upload the file: " + file.getOriginalFilename() + "!";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(message);
		}
	}
	
	//Lấy ảnh
	@GetMapping("/{name}")
	public ResponseEntity<byte[]> getImage(@PathVariable String name) {
		Image image = imageService.getImage(name);

		return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.valueOf("image/png")).body(image.getImage());
	}
	
	//Xoá ảnh
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getImage(@PathVariable Integer id) {
		ImageDTO image = imageService.deleteImage(id);
		return new ResponseEntity<>(image, HttpStatus.OK);
	}
}
