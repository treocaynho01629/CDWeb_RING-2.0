package com.ring.bookstore.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class MailConfig {

    @Value("${spring.mail.host}")
    private String mailHost;

    @Value("${spring.mail.port}")
    private Integer mailPort;

    @Value("${spring.mail.username}")
    private String mailUsername;

    @Value("${spring.mail.password}")
    private String mailPassword;

    @Bean
    public JavaMailSender javaMailSender() {
        try {
            if (mailHost == null || mailPort == null || mailUsername == null || mailPassword == null) {
                System.err.println("Mail configuration is invalid or missing. Mail functionality will not be available.");
                return new JavaMailSenderImpl(); //Return default
            }

            JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
            mailSender.setHost(mailHost);
            mailSender.setPort(mailPort);
            mailSender.setUsername(mailUsername);
            mailSender.setPassword(mailPassword);
            return mailSender;
        } catch (Exception e) {
            System.err.println("Error initializing JavaMailSender: " + e.getMessage());
            return new JavaMailSenderImpl(); //Return default
        }
    }
}
