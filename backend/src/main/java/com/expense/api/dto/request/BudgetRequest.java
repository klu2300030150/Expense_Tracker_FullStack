package com.expense.api.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.YearMonth;

@Data
public class BudgetRequest {
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private Double amount;
    
    @NotNull(message = "Period is required")
    private YearMonth period;
    
    @NotNull(message = "Category ID is required")
    private String categoryId;
    
    private boolean recurring;
}