package com.ring.bookstore.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import com.ring.bookstore.utils.ImageUtils;
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
public class ImageController { //Controller Ảnh
	
	private final ImageService imageService;
	
	//Lấy tất cả Ảnh
	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getAllImages() {
		return new ResponseEntity<>(imageService.getAllImages(), HttpStatus.OK);
	}

	//Tải Ảnh lên Server
	@PostMapping("/upload")
	@PreAuthorize("hasAnyRole('ADMIN','SELLER')")
	public ResponseEntity<?> uploadFile(@RequestParam("image") MultipartFile file) {
		
		try {
			ImageDTO image = imageService.uploadImage(file);
			return new ResponseEntity<>(image, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			String message = "Could not upload the file: " + file.getOriginalFilename() + "!";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(message);
		}
	}

	//Tải nhiều ảnh
	@PostMapping("/upload_multiples")
	public ResponseEntity<?> uploadFiles( @RequestParam("images") MultipartFile[] files) {
		List<String> messages = new ArrayList<>();

		Arrays.asList(files).stream().forEach(file -> {
			try {
				imageService.uploadImage(file);
				messages.add(file.getOriginalFilename() + " [Successful]");
			} catch (Exception e) {
				messages.add(file.getOriginalFilename() + " <Failed> - " + e.getMessage());
			}
		});

		return new ResponseEntity<>(messages, HttpStatus.OK);
	}
	
	//Lấy Ảnh theo {name}
	@GetMapping("/{name}")
	public ResponseEntity<byte[]> getImage(@PathVariable String name) {
		Image image = imageService.getImage(name);
		byte[] imageData = ImageUtils.decompressImage(image.getImage());
		return ResponseEntity.status(HttpStatus.OK)
				.contentType(MediaType.valueOf(image.getType()))
				.body(imageData); //Trả file Ảnh
	}
	
	//Xoá Ảnh theo {id}
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getImage(@PathVariable Integer id) {
		ImageDTO image = imageService.deleteImage(id);
		return new ResponseEntity<>(image, HttpStatus.OK);
	}
}
