package com.ring.bookstore.service;

import org.springframework.stereotype.Service;

@Service
public interface EmailService {
	
    boolean sendSimpleMessage(String to,
                              String subject,
                              String text);
    boolean sendHtmlMessage(String to,
                            String subject,
                            String htmlBody);
}
