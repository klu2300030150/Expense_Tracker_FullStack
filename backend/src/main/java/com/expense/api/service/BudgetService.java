package com.expense.api.service;

import com.expense.api.dto.BudgetDTO;
import java.time.YearMonth;
import java.util.List;

public interface BudgetService {
    BudgetDTO createBudget(BudgetDTO budget);
    BudgetDTO updateBudget(String id, BudgetDTO budget);
    void deleteBudget(String id);
    BudgetDTO getBudget(String id);
    List<BudgetDTO> getAllBudgets();
    List<BudgetDTO> getBudgetsByPeriod(YearMonth period);
    BudgetDTO getBudgetForCategoryAndPeriod(String categoryId, YearMonth period);
    void processRecurringBudgets(YearMonth targetPeriod);
}