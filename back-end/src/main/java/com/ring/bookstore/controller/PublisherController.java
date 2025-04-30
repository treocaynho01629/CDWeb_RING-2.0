package com.ring.bookstore.controller;

import java.util.List;

import com.ring.bookstore.model.dto.request.PublisherRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.ring.bookstore.service.PublisherService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

/**
 * Controller named {@link PublisherController} for handling publisher-related operations.
 * Exposes endpoints under "/api/publishers".
 */
@RestController
@RequestMapping("/api/publishers")
@RequiredArgsConstructor
public class PublisherController {

    private final PublisherService pubService;

    /**
     * Retrieves all publishers with pagination and sorting.
     *
     * @param pageSize size of each page.
     * @param pageNo   page number.
     * @param sortBy   sorting field.
     * @param sortDir  sorting direction.
     * @return a {@link ResponseEntity} containing paginated publishers.
     */
    @GetMapping
    public ResponseEntity<?> getPublishers(@RequestParam(value = "pSize", defaultValue = "20") Integer pageSize,
                                           @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                           @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
                                           @RequestParam(value = "sortDir", defaultValue = "desc") String sortDir) {
        return new ResponseEntity<>(pubService.getPublishers(pageNo, pageSize, sortBy, sortDir), HttpStatus.OK);
    }

    /**
     * Retrieves publishers relevant to a specific category.
     *
     * @param pageSize size of each page.
     * @param pageNo   page number.
     * @param cateId   ID of the category.
     * @return a {@link ResponseEntity} containing relevant publishers.
     */
    @GetMapping("/relevant/{id}")
    public ResponseEntity<?> getRelevantPublishers(@RequestParam(value = "pSize", defaultValue = "20") Integer pageSize,
                                                   @RequestParam(value = "pageNo", defaultValue = "0") Integer pageNo,
                                                   @PathVariable("id") Integer cateId) {
        return new ResponseEntity<>(pubService.getRelevantPublishers(pageNo, pageSize, cateId), HttpStatus.OK);
    }

    /**
     * Retrieves a publisher by its ID.
     *
     * @param id the publisher ID.
     * @return a {@link ResponseEntity} containing the publisher.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getPublisherById(@PathVariable("id") Integer id) {
        return new ResponseEntity<>(pubService.getPublisher(id), HttpStatus.OK);
    }

    /**
     * Creates a new publisher.
     *
     * @param request the {@link PublisherRequest} containing publisher data.
     * @return a {@link ResponseEntity} containing the created publisher.
     */
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('create:publisher')")
    public ResponseEntity<?> createPublisher(@Valid @RequestPart("request") PublisherRequest request,
                                             @RequestPart(name = "image", required = false) MultipartFile file) {
        return new ResponseEntity<>(pubService.addPublisher(request, file), HttpStatus.CREATED);
    }

    /**
     * Updates a publisher by its ID.
     *
     * @param id   the ID of the publisher to update.
     * @param request the updated publisher data.
     * @param file optional updated image file.
     * @return a {@link ResponseEntity} containing the updated publisher.
     */
    @PutMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('update:publisher')")
    public ResponseEntity<?> updatePublisher(@PathVariable("id") Integer id,
                                             @Valid @RequestPart("request") PublisherRequest request,
                                             @RequestPart(name = "image", required = false) MultipartFile file) {
        return new ResponseEntity<>(pubService.updatePublisher(id, request, file), HttpStatus.CREATED);
    }

    /**
     * Deletes a publisher by its ID.
     *
     * @param id the ID of the publisher to delete.
     * @return a {@link ResponseEntity} with a success message.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('delete:publisher')")
    public ResponseEntity<?> deletePublisher(@PathVariable("id") Integer id) {
        pubService.deletePublisher(id);
        return new ResponseEntity<>("Publisher deleted!", HttpStatus.OK);
    }

    /**
     * Deletes multiple publishers by a list of IDs.
     *
     * @param ids list of publisher IDs to delete.
     * @return a {@link ResponseEntity} containing a success message.
     */
    @DeleteMapping("/delete-multiple")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('delete:publisher')")
    public ResponseEntity<?> deletePublishers(@RequestParam("ids") List<Integer> ids) {
        pubService.deletePublishers(ids);
        return new ResponseEntity<>("Publishers deleted successfully!", HttpStatus.OK);
    }

    /**
     * Deletes publishers that are NOT in the given list of IDs.
     *
     * @param ids list of IDs to exclude from deletion.
     * @return a {@link ResponseEntity} containing a success message.
     */
    @DeleteMapping("/delete-inverse")
    @PreAuthorize("hasRole('SELLER') and hasAuthority('delete:book')")
    public ResponseEntity<?> deletePublishersInverse(@RequestParam("ids") List<Integer> ids) {
        pubService.deletePublishersInverse(ids);
        return new ResponseEntity<>("Publishers deleted successfully!", HttpStatus.OK);
    }

    /**
     * Deletes all publishers in the system.
     *
     * @return a {@link ResponseEntity} with a success message.
     */
    @DeleteMapping("/delete-all")
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('delete:publisher')")
    public ResponseEntity<?> deleteAllPublishers() {
        pubService.deleteAllPublishers();
        return new ResponseEntity<>("All publishers deleted successfully!", HttpStatus.OK);
    }
}
