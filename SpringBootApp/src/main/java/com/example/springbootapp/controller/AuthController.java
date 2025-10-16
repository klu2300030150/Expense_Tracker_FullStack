package com.example.springbootapp.controller;

import com.example.springbootapp.dto.AuthDtos.*;
import com.example.springbootapp.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {
    private final AuthService auth;
    public AuthController(AuthService auth){ this.auth = auth; }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req){
        try { return ResponseEntity.ok(auth.register(req)); }
        catch (Exception e){ return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage())); }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req){
        try { return ResponseEntity.ok(auth.login(req)); }
        catch (Exception e){ return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage())); }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(name = "Authorization", required = false) String authHeader){
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return ResponseEntity.status(401).body(new ErrorResponse("No token"));
        String token = authHeader.substring(7);
        try { return ResponseEntity.ok(auth.me(token)); }
        catch (Exception e){ return ResponseEntity.status(401).body(new ErrorResponse(e.getMessage())); }
    }
}
