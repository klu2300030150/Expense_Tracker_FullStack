package com.expense.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.UuidGenerator;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "categories", indexes = {
    @Index(name = "idx_category_name", columnList = "name", unique = true)
})
public class Category {
    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.TIME)
    private String id;
    
    @Column(nullable = false, unique = true, length = 50)
    private String name;
    
    @Column(length = 7)  // For hex color codes
    private String color;
    
    @Column(length = 50)
    private String icon;
    
    @ToString.Exclude
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions = new ArrayList<>();
    
    @ToString.Exclude
    @OneToOne(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private Budget budget;
}