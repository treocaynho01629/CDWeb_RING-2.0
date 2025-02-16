package com.ring.bookstore.controller;

import java.io.IOException;
import java.util.List;

import com.ring.bookstore.exception.ImageResizerException;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ring.bookstore.service.PublisherService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/publishers")
@RequiredArgsConstructor
public class PublisherController {
	
	private final PublisherService pubService;

	//Get publishers
	@GetMapping
	public ResponseEntity<?> getPublishers(@RequestParam(value = "pSize", defaultValue = "20") Integer pageSize,
										   @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
										   @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
										   @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir) {
		return new ResponseEntity<>(pubService.getPublishers(pageNo, pageSize, sortBy, sortDir), HttpStatus.OK);
	}

	//Get publisher by {id}
	@GetMapping("/{id}")
	public ResponseEntity<?> getPublisherById(@PathVariable("id") Integer id) {
		return new ResponseEntity<>(pubService.getPublisher(id), HttpStatus.OK);
	}

	//Add publisher
	@PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
	@PreAuthorize("hasRole('ADMIN') and hasAuthority('CREATE_PRIVILEGE')")
	public ResponseEntity<?> createPublisher(@RequestParam @NotBlank(message = "Tên nhà xuất bản không được bỏ trống!")
		 @Size(min = 1, max = 50, message = "Tên nhà xuất bản dài từ 1-50 kí tự!") String name,
		 @RequestPart(name = "image", required = false) MultipartFile file) throws ImageResizerException, IOException {
		return new ResponseEntity<>(pubService.addPublisher(name, file), HttpStatus.CREATED);
	}

	//Update publisher by id
	@PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
	@PreAuthorize("hasRole('ADMIN') and hasAuthority('UPDATE_PRIVILEGE')")
	public ResponseEntity<?> updatePublisher(@PathVariable("id") Integer id,
		 @RequestParam @NotBlank(message = "Tên nhà xuất bản không được bỏ trống!")
		 @Size(min = 1, max = 50, message = "Tên nhà xuất bản dài từ 1-50 kí tự!") String name,
		 @RequestPart(name = "image", required = false) MultipartFile file) throws ImageResizerException, IOException {
		return new ResponseEntity<>(pubService.updatePublisher(id, name, file), HttpStatus.CREATED);
	}

	//Delete publisher
	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN') and hasAuthority('DELETE_PRIVILEGE')")
	public ResponseEntity<?> deletePublisher(@PathVariable("id") Integer id) {
		pubService.deletePublisher(id);
		return new ResponseEntity<>("Publisher deleted!", HttpStatus.OK);
	}

	//Delete multiples publishers in a lists of {ids}
	@DeleteMapping("/delete-multiples")
	@PreAuthorize("hasRole('ADMIN') and hasAuthority('DELETE_PRIVILEGE')")
	public ResponseEntity<?> deletePublishers(@RequestParam("ids") List<Integer> ids,
											  @RequestParam(value = "isInverse", defaultValue = "false") Boolean isInverse
	) {
		pubService.deletePublishers(ids, isInverse);
		return new ResponseEntity<>("Publishers deleted successfully!", HttpStatus.OK);
	}

	//Delete all publishers
	@DeleteMapping("/delete-all")
	@PreAuthorize("hasRole('ADMIN') and hasAuthority('DELETE_PRIVILEGE')")
	public ResponseEntity<?> deleteAllPublishers() {
		pubService.deleteAllPublishers();
		return new ResponseEntity<>("All publishers deleted successfully!", HttpStatus.OK);
	}
}
