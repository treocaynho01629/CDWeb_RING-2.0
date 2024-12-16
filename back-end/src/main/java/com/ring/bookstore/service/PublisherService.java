package com.ring.bookstore.service;

import java.io.IOException;
import java.util.List;

import com.ring.bookstore.dtos.publishers.PublisherDTO;
import com.ring.bookstore.exception.ImageResizerException;
import com.ring.bookstore.model.Publisher;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface PublisherService {

	Page<PublisherDTO> getPublishers(Integer pageNo,
									 Integer pageSize,
									 String sortBy,
									 String sortDir);

	PublisherDTO getPublisher(Integer id);

	Publisher addPublisher(String name,
						   MultipartFile file) throws IOException, ImageResizerException;

	Publisher updatePublisher(Integer id,
							  String name,
							  MultipartFile file) throws IOException, ImageResizerException;

	void deletePublisher(Integer id);

	void deletePublishers(List<Integer> ids,
						  Boolean isInverse);

	void deleteAllPublishers();
}
