package com.ring.bookstore.service;

import org.springframework.stereotype.Service;

@Service
public interface EmailService {
	
    String sendSimpleMessage(String to, String subject, String text);
    String sendHtmlMessage(String to, String subject, String htmlBody);
}
