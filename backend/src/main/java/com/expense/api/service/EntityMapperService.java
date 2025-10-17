package com.expense.api.service;

import com.expense.api.dto.TransactionDTO;
import com.expense.api.dto.CategoryDTO;
import com.expense.api.dto.BudgetDTO;
import com.expense.api.model.Transaction;
import com.expense.api.model.Category;
import com.expense.api.model.Budget;
import org.springframework.stereotype.Service;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EntityMapperService {
    
    public TransactionDTO toDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setDescription(transaction.getDescription());
        dto.setAmount(transaction.getAmount());
        dto.setDate(transaction.getDate());
        dto.setRecurring(transaction.isRecurring());
        dto.setRecurringOriginId(transaction.getRecurringOriginId());
        dto.setRecurrenceRule(transaction.getRecurrenceRule());
        
        if (transaction.getCategory() != null) {
            dto.setCategoryId(transaction.getCategory().getId());
            dto.setCategoryName(transaction.getCategory().getName());
        }
        
        return dto;
    }
    
    public CategoryDTO toDTO(Category category, YearMonth period) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setColor(category.getColor());
        dto.setIcon(category.getIcon());
        
        // Calculate current month total
        double total = category.getTransactions().stream()
            .filter(t -> YearMonth.from(t.getDate()).equals(period))
            .mapToDouble(Transaction::getAmount)
            .sum();
        dto.setCurrentMonthTotal(total);
        
        // Get current budget if exists
        if (category.getBudget() != null && category.getBudget().getPeriod().equals(period)) {
            dto.setCurrentMonthBudget(category.getBudget().getAmount());
        }
        
        return dto;
    }
    
    public BudgetDTO toDTO(Budget budget) {
        BudgetDTO dto = new BudgetDTO();
        dto.setId(budget.getId());
        dto.setAmount(budget.getAmount());
        dto.setPeriod(budget.getPeriod());
        dto.setRecurring(budget.isRecurring());
        
        if (budget.getCategory() != null) {
            dto.setCategoryId(budget.getCategory().getId());
            dto.setCategoryName(budget.getCategory().getName());
            
            // Calculate current spending
            double spending = budget.getCategory().getTransactions().stream()
                .filter(t -> YearMonth.from(t.getDate()).equals(budget.getPeriod()))
                .mapToDouble(Transaction::getAmount)
                .sum();
            dto.setCurrentSpending(spending);
        }
        
        return dto;
    }
    
    public List<TransactionDTO> toTransactionDTOs(List<Transaction> transactions) {
        return transactions.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    public List<CategoryDTO> toCategoryDTOs(List<Category> categories, YearMonth period) {
        return categories.stream()
            .map(c -> toDTO(c, period))
            .collect(Collectors.toList());
    }
    
    public List<BudgetDTO> toBudgetDTOs(List<Budget> budgets) {
        return budgets.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
}