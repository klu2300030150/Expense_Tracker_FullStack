package com.example.springbootapp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {
    @GetMapping("/")
    public Map<String, Object> root() {
        return Map.of(
                "message", "Spring Boot Backend API",
                "status", "running",
                "endpoints", new String[]{"/health", "/auth/login", "/auth/register", "/auth/me"}
        );
    }
    
    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "UP",
                "service", "SpringBootApp"
        );
    }
}
