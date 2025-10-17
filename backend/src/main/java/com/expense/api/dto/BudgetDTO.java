package com.expense.api.dto;

import lombok.Data;
import java.time.YearMonth;

@Data
public class BudgetDTO {
    private String id;
    private double amount;
    private YearMonth period;
    private String categoryId;
    private String categoryName;
    private boolean recurring;
    private double currentSpending;
}