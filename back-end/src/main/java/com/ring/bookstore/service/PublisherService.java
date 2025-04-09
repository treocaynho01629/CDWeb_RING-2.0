package com.ring.bookstore.service;

import java.util.List;

import com.ring.bookstore.model.dto.request.PublisherRequest;
import com.ring.bookstore.model.dto.response.publishers.PublisherDTO;
import com.ring.bookstore.model.entity.Publisher;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface PublisherService {

	Page<PublisherDTO> getPublishers(Integer pageNo,
									 Integer pageSize,
									 String sortBy,
									 String sortDir);

	Page<PublisherDTO> getRelevantPublishers(Integer pageNo,
									 Integer pageSize,
									 Integer cateId);

	PublisherDTO getPublisher(Integer id);

	Publisher addPublisher(PublisherRequest request,
						   MultipartFile file);

	Publisher updatePublisher(Integer id,
							  PublisherRequest request,
							  MultipartFile file);

	void deletePublisher(Integer id);

	void deletePublishers(List<Integer> ids);

	void deletePublishersInverse(List<Integer> ids);

	void deleteAllPublishers();
}
