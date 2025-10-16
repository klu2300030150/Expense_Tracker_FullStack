package com.example.springbootapp.service;

import com.example.springbootapp.dto.AuthDtos.*;
import com.example.springbootapp.model.User;
import com.example.springbootapp.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class AuthService {
    private final UserRepository users;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository users) { this.users = users; }

    public AuthResponse register(RegisterRequest req) {
        users.findByEmail(req.email).ifPresent(u -> { throw new RuntimeException("Email already in use"); });
        User u = new User();
        u.setEmail(req.email);
        u.setName(req.name);
        u.setPasswordHash(encoder.encode(req.password));
        u = users.save(u);
        String token = makeToken(u);
        return new AuthResponse(token, new UserDTO(u.getId(), u.getEmail(), u.getName()));
    }

    public AuthResponse login(LoginRequest req) {
        User u = users.findByEmail(req.email).orElseThrow(() -> new RuntimeException("User not exists"));
        if (!encoder.matches(req.password, u.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        String token = makeToken(u);
        return new AuthResponse(token, new UserDTO(u.getId(), u.getEmail(), u.getName()));
    }

    public UserDTO me(String token) {
        User u = parseToken(token);
        return new UserDTO(u.getId(), u.getEmail(), u.getName());
    }

    private String makeToken(User u){
        String payload = u.getId()+":"+u.getEmail()+":"+u.getName();
        return Base64.getEncoder().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
    }
    private User parseToken(String token){
        try {
            String s = new String(Base64.getDecoder().decode(token), StandardCharsets.UTF_8);
            String[] parts = s.split(":",3);
            Long id = Long.parseLong(parts[0]);
            return users.findById(id).orElseThrow();
        } catch (Exception e) { throw new RuntimeException("Invalid token"); }
    }
}
