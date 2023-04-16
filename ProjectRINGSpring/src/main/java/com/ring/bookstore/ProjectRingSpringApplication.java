package com.ring.bookstore;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.ring.bookstore.enums.RoleName;
import com.ring.bookstore.model.Role;
import com.ring.bookstore.service.RoleService;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class ProjectRingSpringApplication {
	
	@Autowired
	RoleService roleService;
	
	@PostConstruct
	public void init() {
		
		if (roleService.count()==0) {
			Role role = new Role();
			role.setRoleName(RoleName.ROLE_USER);
			roleService.save(role);
		}
	}

	public static void main(String[] args) {
		SpringApplication.run(ProjectRingSpringApplication.class, args);
	}

}
