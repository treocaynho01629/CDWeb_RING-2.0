package com.ring.service;

import com.ring.dto.request.PublisherRequest;
import com.ring.dto.response.PagingResponse;
import com.ring.dto.response.publishers.PublisherDTO;
import com.ring.model.entity.Publisher;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PublisherService {

	PagingResponse<PublisherDTO> getPublishers(Integer pageNo,
			Integer pageSize,
			String sortBy,
			String sortDir);

	PagingResponse<PublisherDTO> getRelevantPublishers(Integer pageNo,
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
