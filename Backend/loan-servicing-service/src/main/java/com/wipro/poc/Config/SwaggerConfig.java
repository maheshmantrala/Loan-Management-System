package com.wipro.poc.Config;



import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.*;

@Configuration
public class SwaggerConfig {
  @Bean
  public OpenAPI openAPI() {
    return new OpenAPI().info(new Info()
      .title("Loan Servicing Service API")
      .version("v1")
      .description("Manage loan accounts, schedules, and payments"));
  }
}
