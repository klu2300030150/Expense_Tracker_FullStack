package com.expense.api.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "transactions", indexes = {
    @Index(name = "idx_transaction_date", columnList = "date"),
    @Index(name = "idx_transaction_category", columnList = "category_id")
})
public class Transaction {
    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.TIME)
    private String id;
    
    @Column(nullable = false)
    private String description;
    
    @Column(nullable = false)
    private double amount;
    
    @Column(nullable = false)
    private LocalDateTime date;
    
    @Column(nullable = false)
    private boolean recurring;
    
    private String recurringOriginId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    
    @Column(columnDefinition = "TEXT")
    private String recurrenceRule;
}