package com.example.springbootapp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {
    // Removed root mapping "/" - conflicts with React frontend
    // Root path now serves React app via SpaController
    
    @GetMapping("/api/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "UP",
                "service", "SpringBootApp",
                "message", "Spring Boot Backend API",
                "endpoints", new String[]{"/api/health", "/api/auth/login", "/api/auth/register", "/api/auth/me"}
        );
    }
}
