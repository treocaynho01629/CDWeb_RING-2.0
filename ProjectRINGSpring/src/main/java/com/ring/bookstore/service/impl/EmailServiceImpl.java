package com.ring.bookstore.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.ring.bookstore.service.EmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
	
    private final JavaMailSender emailSender;
    
    @Value("${spring.mail.username}") //Lấy mail gửi từ file Properties
    private String sender;

    //Gửi mail thường
    public String sendSimpleMessage(String to, String subject, String text) {
    	
        try {
        	//Tạo mail
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(sender);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);

            emailSender.send(message); //Gửi
            return "Gửi email thành công";
        } catch (MailException e) {
            e.printStackTrace();
            return "Gửi email thất bại";
        }
    }

    //Gửi mail Html
    public String sendHtmlMessage(String to, String subject, String htmlBody) {
    	
        try {
        	//Tạo mail
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(sender);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            
            emailSender.send(message); //Gửi
            return "Gửi email thành công";
        } catch (MessagingException e) {
        	e.printStackTrace();
            return "Gửi email thất bại";
        }
    }
}
