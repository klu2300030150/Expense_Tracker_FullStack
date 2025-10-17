package com.expense.api.service;

import com.expense.api.dto.TransactionDTO;
import java.time.LocalDateTime;
import java.util.List;

public interface TransactionService {
    TransactionDTO createTransaction(TransactionDTO transaction);
    TransactionDTO updateTransaction(String id, TransactionDTO transaction);
    void deleteTransaction(String id);
    TransactionDTO getTransaction(String id);
    List<TransactionDTO> getAllTransactions();
    List<TransactionDTO> getTransactionsByDateRange(LocalDateTime start, LocalDateTime end);
    List<TransactionDTO> getTransactionsByCategory(String categoryId);
    void processRecurringTransactions();
}