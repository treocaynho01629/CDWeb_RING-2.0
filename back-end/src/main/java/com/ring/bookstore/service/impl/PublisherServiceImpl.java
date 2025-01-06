package com.ring.bookstore.service.impl;

import java.io.IOException;
import java.util.List;

import com.ring.bookstore.dtos.publishers.PublisherDTO;
import com.ring.bookstore.dtos.mappers.PublisherMapper;
import com.ring.bookstore.dtos.publishers.IPublisher;
import com.ring.bookstore.exception.ImageResizerException;
import com.ring.bookstore.model.Image;
import com.ring.bookstore.model.Publisher;
import com.ring.bookstore.service.ImageService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.repository.PublisherRepository;
import com.ring.bookstore.service.PublisherService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@Service
public class PublisherServiceImpl implements PublisherService {

    private final PublisherRepository pubRepo;
    private final PublisherMapper pubMapper;
    private final ImageService imageService;

    @Override
    public Page<PublisherDTO> getPublishers(Integer pageNo, Integer pageSize, String sortBy, String sortDir) {
       Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending());

        //Fetch from database
        Page<IPublisher> pubsList = pubRepo.findPublishers(pageable);
        Page<PublisherDTO> pubDTOS = pubsList.map(pubMapper::apply);
        return pubDTOS;
    }

    @Override
    public PublisherDTO getPublisher(Integer id) {
        IPublisher publisher = pubRepo.findProjectionById(id).orElseThrow(() ->
                new ResourceNotFoundException("Publisher not found!"));

        PublisherDTO publisherDTO = pubMapper.apply(publisher); //Map to DTO
        return publisherDTO;
    }

    @Transactional
    public Publisher addPublisher(String name, MultipartFile file) throws IOException, ImageResizerException {
        Image image = null;

        //Image upload
        if (file != null) image = imageService.upload(file);

        //Create new publisher
        var publisher = Publisher.builder()
                .name(name)
                .image(image)
                .build();
        Publisher addedPub = pubRepo.save(publisher); //Save to database
        return addedPub;
    }

    @Transactional
    public Publisher updatePublisher(Integer id, String name, MultipartFile file) throws IOException, ImageResizerException {
        //Get original publisher
        Publisher publisher = pubRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Publisher not found"));

        //Image upload/replace
        if (file != null) { //Contain new image >> upload/replace
            Long imageId = publisher.getImage().getId();
            if (imageId != null) imageService.deleteImage(imageId); //Delete old image

            Image savedImage = imageService.upload(file); //Upload new image
            publisher.setImage(savedImage); //Set new image
        }

        publisher.setName(name);

        //Update
        Publisher updatedPub = pubRepo.save(publisher);
        return updatedPub;
    }

    @Transactional
    public void deletePublisher(Integer id) {
        pubRepo.deleteById(id);
    }

    @Transactional
    public void deletePublishers(List<Integer> ids, Boolean isInverse) {
        List<Integer> listDelete = ids;
        if (isInverse) listDelete = pubRepo.findInverseIds(ids);
        pubRepo.deleteAllByIdInBatch(listDelete);
    }

    @Transactional
    public void deleteAllPublishers() {
        pubRepo.deleteAll();
    }
}
