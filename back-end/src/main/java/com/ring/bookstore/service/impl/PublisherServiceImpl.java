package com.ring.bookstore.service.impl;

import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.dto.request.PublisherRequest;
import com.ring.bookstore.model.dto.response.publishers.PublisherDTO;
import com.ring.bookstore.model.entity.Image;
import com.ring.bookstore.model.entity.Publisher;
import com.ring.bookstore.model.mappers.PublisherMapper;
import com.ring.bookstore.repository.PublisherRepository;
import com.ring.bookstore.service.ImageService;
import com.ring.bookstore.service.PublisherService;
import com.ring.bookstore.ultils.FileUploadUtil;
import com.ring.bookstore.model.dto.response.PagingResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@Service
public class PublisherServiceImpl implements PublisherService {

    private final PublisherRepository pubRepo;
    private final PublisherMapper pubMapper;
    private final ImageService imageService;

    @Cacheable(cacheNames = "publishers")
    public PagingResponse<PublisherDTO> getPublishers(Integer pageNo,
            Integer pageSize,
            String sortBy,
            String sortDir) {
        Pageable pageable = PageRequest.of(pageNo, pageSize,
                sortDir.equals("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());

        // Fetch from database
        Page<Publisher> pubsList = pubRepo.findPublishers(pageable);
        List<PublisherDTO> pubDTOS = pubsList.map(pubMapper::apply).toList();
        return new PagingResponse<>(
                pubDTOS,
                pubsList.getTotalPages(),
                pubsList.getTotalElements(),
                pubsList.getSize(),
                pubsList.getNumber(),
                pubsList.isEmpty());
    }

    @Cacheable(cacheNames = "publishers")
    public PagingResponse<PublisherDTO> getRelevantPublishers(Integer pageNo,
            Integer pageSize,
            Integer cateId) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by("id").descending());

        // Fetch from database
        Page<Publisher> pubsList = pubRepo.findRelevantPublishers(cateId, pageable);
        List<PublisherDTO> pubDTOS = pubsList.map(pubMapper::apply).toList();
        return new PagingResponse<>(
                pubDTOS,
                pubsList.getTotalPages(),
                pubsList.getTotalElements(),
                pubsList.getSize(),
                pubsList.getNumber(),
                pubsList.isEmpty());
    }

    @Cacheable(cacheNames = "publisher", key = "#id")
    public PublisherDTO getPublisher(Integer id) {
        Publisher publisher = pubRepo.findWithImageById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Publisher not found!",
                        "Không tìm thấy nhà xuất bản yêu cầu!"));

        PublisherDTO publisherDTO = pubMapper.apply(publisher); // Map to DTO
        return publisherDTO;
    }

    @CacheEvict(cacheNames = "publishers")
    @Transactional
    public Publisher addPublisher(PublisherRequest request,
            MultipartFile file) {
        Image image = null;

        // Image upload
        if (file != null)
            image = imageService.upload(file, FileUploadUtil.ASSET_FOLDER);

        // Create new publisher
        var publisher = Publisher.builder()
                .name(request.getName())
                .image(image)
                .build();
        Publisher addedPub = pubRepo.save(publisher); // Save to database
        return addedPub;
    }

    @Caching(evict = { @CacheEvict(cacheNames = "publishers"),
            @CacheEvict(cacheNames = "publisher", key = "#id") })
    @Transactional
    public Publisher updatePublisher(Integer id,
            PublisherRequest request,
            MultipartFile file) {
        // Get original publisher
        Publisher publisher = pubRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Publisher not found",
                        "Không tìm thấy nhà xuất bản yêu cầu!"));

        // Image upload/replace
        if (file != null) { // Contain new image >> upload/replace
            Long imageId = publisher.getImage() != null ? publisher.getImage().getId() : null;
            if (imageId != null)
                imageService.deleteImage(imageId); // Delete old image

            Image savedImage = imageService.upload(file, FileUploadUtil.ASSET_FOLDER); // Upload new image
            publisher.setImage(savedImage); // Set new image
        }

        publisher.setName(request.getName());

        // Update
        Publisher updatedPub = pubRepo.save(publisher);
        return updatedPub;
    }

    @Caching(evict = { @CacheEvict(cacheNames = "publishers"),
            @CacheEvict(cacheNames = "publisher", key = "#id") })
    @Transactional
    public void deletePublisher(Integer id) {
        pubRepo.deleteById(id);
    }

    @CacheEvict(cacheNames = "publishers")
    @Transactional
    public void deletePublishers(List<Integer> ids) {
        pubRepo.deleteAllByIdInBatch(ids);
    }

    @CacheEvict(cacheNames = "publishers")
    @Transactional
    public void deletePublishersInverse(List<Integer> ids) {
        List<Integer> listDelete = pubRepo.findInverseIds(ids);
        pubRepo.deleteAllByIdInBatch(listDelete);
    }

    @CacheEvict(cacheNames = "publishers")
    @Transactional
    public void deleteAllPublishers() {
        pubRepo.deleteAll();
    }
}
