package com.expense.api.service.impl;

import com.expense.api.dto.TransactionDTO;
import com.expense.api.model.Transaction;
import com.expense.api.model.Category;
import com.expense.api.repository.TransactionRepository;
import com.expense.api.repository.CategoryRepository;
import com.expense.api.service.TransactionService;
import com.expense.api.service.EntityMapperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.EntityNotFoundException;

@Service
public class TransactionServiceImpl implements TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private EntityMapperService mapper;
    
    @Override
    @Transactional
    public TransactionDTO createTransaction(TransactionDTO dto) {
        Transaction transaction = new Transaction();
        updateTransactionFromDTO(transaction, dto);
        transaction = transactionRepository.save(transaction);
        return mapper.toDTO(transaction);
    }
    
    @Override
    @Transactional
    public TransactionDTO updateTransaction(String id, TransactionDTO dto) {
        Transaction transaction = transactionRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Transaction not found"));
        updateTransactionFromDTO(transaction, dto);
        transaction = transactionRepository.save(transaction);
        return mapper.toDTO(transaction);
    }
    
    @Override
    @Transactional
    public void deleteTransaction(String id) {
        transactionRepository.deleteById(id);
    }
    
    @Override
    public TransactionDTO getTransaction(String id) {
        Transaction transaction = transactionRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Transaction not found"));
        return mapper.toDTO(transaction);
    }
    
    @Override
    public List<TransactionDTO> getAllTransactions() {
        return mapper.toTransactionDTOs(transactionRepository.findAll());
    }
    
    @Override
    public List<TransactionDTO> getTransactionsByDateRange(LocalDateTime start, LocalDateTime end) {
        return mapper.toTransactionDTOs(transactionRepository.findByDateBetween(start, end));
    }
    
    @Override
    public List<TransactionDTO> getTransactionsByCategory(String categoryId) {
        return mapper.toTransactionDTOs(transactionRepository.findByCategory_Id(categoryId));
    }
    
    @Override
    @Transactional
    public void processRecurringTransactions() {
        List<Transaction> recurringTransactions = transactionRepository.findByRecurring(true);
        LocalDateTime now = LocalDateTime.now();

        for (Transaction recurring : recurringTransactions) {
            if (recurring.getRecurrenceRule() == null) continue;

            // Parse and validate recurrence rule
            try {
                String[] ruleParts = recurring.getRecurrenceRule().split(";");
                String freq = ruleParts[0].split("=")[1];
                int interval = Integer.parseInt(ruleParts[1].split("=")[1]);
                LocalDateTime until = ruleParts.length > 2 ? LocalDateTime.parse(ruleParts[2].split("=")[1]) : null;

                LocalDateTime next = recurring.getDate();
                while (next.isBefore(now) && (until == null || next.isBefore(until))) {
                    // Create next occurrence
                    Transaction occurrence = new Transaction();
                    occurrence.setDescription(recurring.getDescription());
                    occurrence.setAmount(recurring.getAmount());
                    occurrence.setCategory(recurring.getCategory());
                    occurrence.setRecurring(false);
                    occurrence.setRecurringOriginId(recurring.getId());

                    // Calculate next date based on frequency
                    if (freq.equals("DAILY")) {
                        next = next.plusDays(interval);
                    } else if (freq.equals("WEEKLY")) {
                        next = next.plusWeeks(interval);
                    } else if (freq.equals("MONTHLY")) {
                        next = next.plusMonths(interval);
                    }
                    occurrence.setDate(next);

                    transactionRepository.save(occurrence);
                }
            } catch (Exception e) {
                // Log error but continue processing other recurring transactions
                System.err.println("Error processing recurring transaction " + recurring.getId() + ": " + e.getMessage());
            }
        }
    }
    
    private void updateTransactionFromDTO(Transaction transaction, TransactionDTO dto) {
        transaction.setDescription(dto.getDescription());
        transaction.setAmount(dto.getAmount());
        transaction.setDate(dto.getDate());
        transaction.setRecurring(dto.isRecurring());
        transaction.setRecurringOriginId(dto.getRecurringOriginId());
        transaction.setRecurrenceRule(dto.getRecurrenceRule());
        
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
            transaction.setCategory(category);
        }
    }
}