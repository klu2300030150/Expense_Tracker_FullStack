package com.expense.api.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TransactionDTO {
    private String id;
    private String description;
    private double amount;
    private LocalDateTime date;
    private boolean recurring;
    private String recurringOriginId;
    private String categoryId;
    private String categoryName;
    private String recurrenceRule;
}