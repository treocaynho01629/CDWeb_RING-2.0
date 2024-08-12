package com.ring.bookstore.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ring.bookstore.model.Publisher;
import com.ring.bookstore.service.PublisherService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/publishers")
@RequiredArgsConstructor
public class PublisherController {
	
	private final PublisherService pubService;
	
	//Get all publishers
	@GetMapping()
	public ResponseEntity<?> getAllCategories(){
		List<Publisher> publishers =  pubService.getAllPublishers();
		return new ResponseEntity< >(publishers, HttpStatus.OK);
	}
}
