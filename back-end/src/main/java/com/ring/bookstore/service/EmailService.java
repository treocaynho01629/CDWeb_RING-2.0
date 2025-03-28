package com.ring.bookstore.service;

import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

@Service
public interface EmailService {
	
    void sendSimpleMail(String to,
                        String subject,
                        String text);
    void sendTemplateMail(String to,
                          String subject,
                          String template,
                          Context context);
}
