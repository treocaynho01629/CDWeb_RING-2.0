package com.ring.bookstore.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ring.bookstore.exception.ResourceNotFoundException;
import com.ring.bookstore.model.Publisher;
import com.ring.bookstore.repository.PublisherRepository;
import com.ring.bookstore.service.PublisherService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class PublisherServiceImpl implements PublisherService {
	
	private final PublisherRepository pubRepo;

	//Get all publishers
	public List<Publisher> getAllPublishers() {
		return pubRepo.findAll();
	}

	//Get publisher by {id}
	public Publisher getPublisherById(Integer id) {
		return pubRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Publisher does not exists!"));
	}
	

}
