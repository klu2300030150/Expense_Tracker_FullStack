package com.expense.api.repository;

import com.expense.api.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, String> {
    List<Transaction> findByDateBetween(LocalDateTime start, LocalDateTime end);
    List<Transaction> findByRecurring(boolean recurring);
    List<Transaction> findByCategory_Id(String categoryId);
}