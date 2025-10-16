package com.example.springbootapp.dto;

public class AuthDtos {
    public static class RegisterRequest {
        public String email;
        public String name;
        public String password;
    }
    public static class LoginRequest {
        public String email;
        public String password;
    }
    public static class AuthResponse {
        public String token;
        public UserDTO user;
        public AuthResponse(String token, UserDTO user){ this.token = token; this.user = user; }
    }
    public static class ErrorResponse {
        public String error;
        public ErrorResponse(String error){ this.error = error; }
    }
    public static class UserDTO {
        public Long id;
        public String email;
        public String name;
        public UserDTO(Long id, String email, String name){ this.id=id; this.email=email; this.name=name; }
    }
}
