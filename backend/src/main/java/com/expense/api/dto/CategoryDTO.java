package com.expense.api.dto;

import lombok.Data;

@Data
public class CategoryDTO {
    private String id;
    private String name;
    private String color;
    private String icon;
    private double currentMonthTotal;
    private double currentMonthBudget;
}