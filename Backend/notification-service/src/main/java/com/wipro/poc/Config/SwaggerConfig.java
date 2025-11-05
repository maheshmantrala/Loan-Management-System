package com.wipro.poc.Config;

import org.springframework.context.annotation.*;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {
  @Bean
  public OpenAPI openAPI() {
    return new OpenAPI().info(new Info()
      .title("Notification Service API")
      .version("v1")
      .description("Email/SMS notification endpoints (dev stub)"));
  }
}
