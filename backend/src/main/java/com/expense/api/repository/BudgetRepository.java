package com.expense.api.repository;

import com.expense.api.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.YearMonth;
import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, String> {
    List<Budget> findByPeriod(YearMonth period);
    Budget findByCategory_IdAndPeriod(String categoryId, YearMonth period);
    List<Budget> findByRecurring(boolean recurring);
}