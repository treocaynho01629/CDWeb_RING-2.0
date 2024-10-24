package com.ring.bookstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ProjectRingSpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProjectRingSpringApplication.class, args);
	}

}
