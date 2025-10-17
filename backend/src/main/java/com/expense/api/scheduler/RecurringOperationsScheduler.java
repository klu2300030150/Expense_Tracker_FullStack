package com.expense.api.scheduler;

import com.expense.api.service.TransactionService;
import com.expense.api.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.YearMonth;

@Component
public class RecurringOperationsScheduler {
    
    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private BudgetService budgetService;
    
    // Run at midnight on the first day of each month
    @Scheduled(cron = "0 0 0 1 * *")
    public void processMonthlyRecurringOperations() {
        YearMonth currentMonth = YearMonth.now();
        
        // Process recurring transactions
        transactionService.processRecurringTransactions();
        
        // Process recurring budgets for the current month
        budgetService.processRecurringBudgets(currentMonth);
    }
}