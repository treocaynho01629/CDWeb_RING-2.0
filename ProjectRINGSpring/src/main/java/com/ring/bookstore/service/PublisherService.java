package com.ring.bookstore.service;

import java.util.List;

import com.ring.bookstore.model.Publisher;

public interface PublisherService {
	
	List<Publisher> getAllPublishers();
	Publisher getPublisherById(Integer id);
}
