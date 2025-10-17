package com.expense.api.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;
import java.time.YearMonth;

@Data
@Entity
@Table(name = "budgets", indexes = {
    @Index(name = "idx_budget_category_period", columnList = "category_id,period", unique = true)
})
public class Budget {
    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.TIME)
    private String id;
    
    @Column(nullable = false)
    private double amount;
    
    @Column(nullable = false)
    private YearMonth period;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @Column(nullable = false)
    private boolean recurring;
}