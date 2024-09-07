package com.ring.bookstore.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.ring.bookstore.exception.ImageResizerException;
import org.springframework.http.HttpHeaders;
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
	
	//Get all images
	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getAllImages() {
		return new ResponseEntity<>(imageService.getAllImages(), HttpStatus.OK);
	}

	//Upload image
	@PostMapping("/upload")
	@PreAuthorize("hasAnyRole('ADMIN')")
	public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) {
		if (file.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File does not exist!");
		}

		try {
			ImageDTO image = imageService.uploadAndMap(file);
			return new ResponseEntity<>(image, HttpStatus.OK);
		} catch (Exception e) {
			String message = "Could not upload the file: " + file.getOriginalFilename() + "!";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(message);
		}
	}

	//Upload multiples images
	@PostMapping("/upload_multiples")
	@PreAuthorize("hasAnyRole('ADMIN')")
	public ResponseEntity<?> uploadImages( @RequestParam("images") MultipartFile[] files) {
		List<String> messages = new ArrayList<>();

		Arrays.asList(files).forEach(file -> {
			try {
				imageService.upload(file);
				messages.add(file.getOriginalFilename() + " [Successful]");
			} catch (Exception e) {
				messages.add(file.getOriginalFilename() + " <Failed> - " + e.getMessage());
			}
		});

		return new ResponseEntity<>(messages, HttpStatus.OK);
	}

	//Upload image
	@PostMapping("/replace")
	@PreAuthorize("hasAnyRole('ADMIN')")
	public ResponseEntity<?> replaceImage(@RequestParam("image") MultipartFile file) {
		if (file.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File does not exist!");
		}

		try {
			ImageDTO image = imageService.replaceAndMap(file);
			return new ResponseEntity<>(image, HttpStatus.OK);
		} catch (Exception e) {
			String message = "Could not upload the file: " + file.getOriginalFilename() + "!";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(message);
		}
	}

	//Upload multiples images
	@PostMapping("/replace_multiples")
	@PreAuthorize("hasAnyRole('ADMIN')")
	public ResponseEntity<?> replaceImages( @RequestParam("images") MultipartFile[] files) {
		List<String> messages = new ArrayList<>();

		Arrays.asList(files).forEach(file -> {
			try {
				imageService.replace(file);
				messages.add(file.getOriginalFilename() + " [Successful]");
			} catch (Exception e) {
				messages.add(file.getOriginalFilename() + " <Failed> - " + e.getMessage());
			}
		});

		return new ResponseEntity<>(messages, HttpStatus.OK);
	}
	
	//Get image by {name}
	@GetMapping("/{name}")
	public ResponseEntity<?> getImage(@PathVariable String name,
									   @RequestParam(value = "size", defaultValue = "original") String predefinedTypeName) {
		final HttpHeaders headers = new HttpHeaders();
		try {
			Image image = imageService.resolve(predefinedTypeName, name);
			return ResponseEntity.status(HttpStatus.OK)
					.contentType(MediaType.valueOf(image.getType()))
					.body(image.getImage()); //Return image
		} catch (ImageResizerException e) {
			headers.setContentType(MediaType.TEXT_HTML);
			return new ResponseEntity<>(e.getMessage(), headers, e.getStatus());
		}
	}
	
	//Delete image by {id}
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> deleteImage(@PathVariable Integer id) {
		String response = imageService.deleteImage(id);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
