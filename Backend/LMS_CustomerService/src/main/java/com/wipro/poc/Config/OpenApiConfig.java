package com.wipro.poc.Config;



import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customerServiceOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Customer Service API")
                .description("APIs for managing customers and KYC status")
                .version("1.0"));
    }
}
