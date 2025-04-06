package com.ring.bookstore.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

/**
 * Configuration class to set up the mail service for sending emails.
 */
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

    /**
     * Configures and returns a {@link JavaMailSender} bean for sending emails.
     * <p>
     * This method reads the required properties (host, port, username, password) from the configuration
     * and sets them in a {@link JavaMailSenderImpl} instance. If any configuration is missing or invalid,
     * the method returns a default {@link JavaMailSenderImpl} with minimal configuration.
     * </p>
     *
     * @return The {@link JavaMailSender} bean configured with mail server details or a default one if configurations are missing.
     */
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
