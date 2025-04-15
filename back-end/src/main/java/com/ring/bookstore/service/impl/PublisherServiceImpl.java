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
import lombok.RequiredArgsConstructor;
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

    @Override
    public Page<PublisherDTO> getPublishers(Integer pageNo,
                                            Integer pageSize,
                                            String sortBy,
                                            String sortDir) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, sortDir.equals("asc") ?
                Sort.by(sortBy).ascending() :
                Sort.by(sortBy).descending());

        //Fetch from database
        Page<Publisher> pubsList = pubRepo.findPublishers(pageable);
        Page<PublisherDTO> pubDTOS = pubsList.map(pubMapper::apply);
        return pubDTOS;
    }

    @Override
    public Page<PublisherDTO> getRelevantPublishers(Integer pageNo,
                                                    Integer pageSize,
                                                    Integer cateId) {
        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by("id").descending());

        //Fetch from database
        Page<Publisher> pubsList = pubRepo.findRelevantPublishers(cateId, pageable);
        Page<PublisherDTO> pubDTOS = pubsList.map(pubMapper::apply);
        return pubDTOS;
    }

    @Override
    public PublisherDTO getPublisher(Integer id) {
        Publisher publisher = pubRepo.findWithImageById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Publisher not found!",
                        "Không tìm thấy nhà xuất bản yêu cầu!"));

        PublisherDTO publisherDTO = pubMapper.apply(publisher); //Map to DTO
        return publisherDTO;
    }

    @Transactional
    public Publisher addPublisher(PublisherRequest request,
                                  MultipartFile file) {
        Image image = null;

        //Image upload
        if (file != null) image = imageService.upload(file, FileUploadUtil.ASSET_FOLDER);

        //Create new publisher
        var publisher = Publisher.builder()
                .name(request.getName())
                .image(image)
                .build();
        Publisher addedPub = pubRepo.save(publisher); //Save to database
        return addedPub;
    }

    @Transactional
    public Publisher updatePublisher(Integer id,
                                     PublisherRequest request,
                                     MultipartFile file) {
        //Get original publisher
        Publisher publisher = pubRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Publisher not found",
                        "Không tìm thấy nhà xuất bản yêu cầu!"));

        //Image upload/replace
        if (file != null) { //Contain new image >> upload/replace
            Long imageId = publisher.getImage().getId();
            if (imageId != null) imageService.deleteImage(imageId); //Delete old image

            Image savedImage = imageService.upload(file, FileUploadUtil.ASSET_FOLDER); //Upload new image
            publisher.setImage(savedImage); //Set new image
        }

        publisher.setName(request.getName());

        //Update
        Publisher updatedPub = pubRepo.save(publisher);
        return updatedPub;
    }

    @Transactional
    public void deletePublisher(Integer id) {
        pubRepo.deleteById(id);
    }

    @Transactional
    public void deletePublishers(List<Integer> ids) {
        pubRepo.deleteAllByIdInBatch(ids);
    }

    @Transactional
    public void deletePublishersInverse(List<Integer> ids) {
        List<Integer> listDelete = pubRepo.findInverseIds(ids);
        pubRepo.deleteAllByIdInBatch(ids);
    }

    @Transactional
    public void deleteAllPublishers() {
        pubRepo.deleteAll();
    }
}
