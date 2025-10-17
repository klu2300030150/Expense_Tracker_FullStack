package com.expense.api.service.impl;

import com.expense.api.dto.BudgetDTO;
import com.expense.api.model.Budget;
import com.expense.api.model.Category;
import com.expense.api.repository.BudgetRepository;
import com.expense.api.repository.CategoryRepository;
import com.expense.api.service.BudgetService;
import com.expense.api.service.EntityMapperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.YearMonth;
import java.util.List;
import jakarta.persistence.EntityNotFoundException;

@Service
public class BudgetServiceImpl implements BudgetService {
    
    @Autowired
    private BudgetRepository budgetRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private EntityMapperService mapper;
    
    @Override
    @Transactional
    public BudgetDTO createBudget(BudgetDTO dto) {
        Budget budget = new Budget();
        updateBudgetFromDTO(budget, dto);
        budget = budgetRepository.save(budget);
        return mapper.toDTO(budget);
    }
    
    @Override
    @Transactional
    public BudgetDTO updateBudget(String id, BudgetDTO dto) {
        Budget budget = budgetRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Budget not found"));
        updateBudgetFromDTO(budget, dto);
        budget = budgetRepository.save(budget);
        return mapper.toDTO(budget);
    }
    
    @Override
    @Transactional
    public void deleteBudget(String id) {
        budgetRepository.deleteById(id);
    }
    
    @Override
    public BudgetDTO getBudget(String id) {
        Budget budget = budgetRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Budget not found"));
        return mapper.toDTO(budget);
    }
    
    @Override
    public List<BudgetDTO> getAllBudgets() {
        return mapper.toBudgetDTOs(budgetRepository.findAll());
    }
    
    @Override
    public List<BudgetDTO> getBudgetsByPeriod(YearMonth period) {
        return mapper.toBudgetDTOs(budgetRepository.findByPeriod(period));
    }
    
    @Override
    public BudgetDTO getBudgetForCategoryAndPeriod(String categoryId, YearMonth period) {
        Budget budget = budgetRepository.findByCategory_IdAndPeriod(categoryId, period);
        return budget != null ? mapper.toDTO(budget) : null;
    }
    
    @Override
    @Transactional
    public void processRecurringBudgets(YearMonth targetPeriod) {
        List<Budget> recurringBudgets = budgetRepository.findByRecurring(true);
        
        for (Budget recurringBudget : recurringBudgets) {
            // Check if budget already exists for the target period
            Budget existingBudget = budgetRepository.findByCategory_IdAndPeriod(
                recurringBudget.getCategory().getId(), 
                targetPeriod
            );
            
            if (existingBudget == null) {
                Budget newBudget = new Budget();
                newBudget.setAmount(recurringBudget.getAmount());
                newBudget.setPeriod(targetPeriod);
                newBudget.setCategory(recurringBudget.getCategory());
                newBudget.setRecurring(false);
                budgetRepository.save(newBudget);
            }
        }
    }
    
    private void updateBudgetFromDTO(Budget budget, BudgetDTO dto) {
        if (dto.getAmount() <= 0) {
            throw new IllegalArgumentException("Budget amount must be greater than zero");
        }
        budget.setAmount(dto.getAmount());
        
        if (dto.getPeriod() == null) {
            throw new IllegalArgumentException("Budget period is required");
        }
        budget.setPeriod(dto.getPeriod());
        
        budget.setRecurring(dto.isRecurring());
        
        if (dto.getCategoryId() == null) {
            throw new IllegalArgumentException("Category ID is required for budget");
        }
        
        Category category = categoryRepository.findById(dto.getCategoryId())
            .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        budget.setCategory(category);
        
        // Check for duplicate budget in the same period
        Budget existing = budgetRepository.findByCategory_IdAndPeriod(category.getId(), dto.getPeriod());
        if (existing != null && !existing.getId().equals(budget.getId())) {
            throw new IllegalStateException("A budget already exists for this category and period");
        }
    }
}