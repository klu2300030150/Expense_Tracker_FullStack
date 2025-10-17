package com.expense.api.service;

import com.expense.api.model.User;

public interface UserService {
    User registerUser(User user);
    User authenticateUser(String email, String password);
}