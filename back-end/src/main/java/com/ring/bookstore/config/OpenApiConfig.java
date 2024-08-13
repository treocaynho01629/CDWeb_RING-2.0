package com.ring.bookstore.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

        @Value("${ring.openapi.dev-url}")
        private String devUrl;

        @Value("${ring.openapi.prod-url}")
        private String prodUrl;
        @Bean
        GroupedOpenApi publicApi() {
                return GroupedOpenApi.builder()
                        .group("public-apis")
                        .pathsToMatch("/**")
                        .build();
        }

        @Bean
        OpenAPI customOpenAPI() {
                Server devServer = new Server()
                        .url(devUrl)
                        .description("Server URL in Development environment");

                Server prodServer = new Server()
                        .url(prodUrl)
                        .description("Server URL in Production environment");

                Contact contact = new Contact()
                        .name("Trong Ha Duc")
                        .email("haductrong01629@gmail.com")
                        .url("https://github.com/treocaynho01629");

                Info info = new Info()
                        .title("OpenAPI specification - RING-Bookstore")
                        .version("1.0")
                        .contact(contact)
                        .description("OpenAPI documentation.");

                return new OpenAPI().info(info).servers(List.of(devServer, prodServer));
        }
}
