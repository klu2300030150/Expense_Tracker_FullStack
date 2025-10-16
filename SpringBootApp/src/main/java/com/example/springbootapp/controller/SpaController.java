package com.example.springbootapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {
    
    // Forward all non-API, non-static routes to index.html for React Router
    // This handles React Router paths like /dashboard, /transactions, etc.
    @GetMapping(value = {
        "/dashboard", "/dashboard/**",
        "/transactions", "/transactions/**", 
        "/budgets", "/budgets/**",
        "/insights", "/insights/**",
        "/settings", "/settings/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
