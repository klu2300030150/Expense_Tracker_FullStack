package com.expense.api.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TransactionRequest {
    @NotBlank(message = "Description is required")
    @Size(min = 1, max = 255, message = "Description must be between 1 and 255 characters")
    private String description;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private Double amount;
    
    @NotNull(message = "Date is required")
    private LocalDateTime date;
    
    private boolean recurring;
    private String recurringOriginId;
    private String categoryId;
    private String recurrenceRule;
}