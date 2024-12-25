package com.ring.bookstore.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.ring.bookstore.service.EmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final Logger log = LoggerFactory.getLogger(getClass());
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.sender}")
    private String sender;

    @Value("${ring.client-url}")
    private String clientUrl;

    //Normal email
    public void sendSimpleMail(String to, String subject, String text) {
        try {
        	//Create
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(sender);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);

            mailSender.send(message); //Send
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    //Mail with HTML
    public void sendTemplateMail(String to, String subject, String template, Context context) {
        context.setVariable("logo", "logo");
        context.setVariable("clientUrl", clientUrl);

        try {
        	//Create
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            //Get template
            String htmlContent = templateEngine.process(template, context);

            //Set properties
            helper.setFrom(sender);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            //Add logo (After setText else mail readers might not be able to resolve inline references correctly)
            helper.addInline("logo", new ClassPathResource("static/logo.png"));
            
            mailSender.send(message); //Send
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }
}
