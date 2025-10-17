package com.expense.api.controller;

import com.expense.api.dto.BudgetDTO;
import com.expense.api.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "http://localhost:5173")
public class BudgetController {
    
    @Autowired
    private BudgetService budgetService;
    
    @PostMapping
    public ResponseEntity<BudgetDTO> createBudget(@RequestBody BudgetDTO budget) {
        return ResponseEntity.ok(budgetService.createBudget(budget));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<BudgetDTO> updateBudget(
            @PathVariable String id,
            @RequestBody BudgetDTO budget) {
        return ResponseEntity.ok(budgetService.updateBudget(id, budget));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable String id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BudgetDTO> getBudget(@PathVariable String id) {
        return ResponseEntity.ok(budgetService.getBudget(id));
    }
    
    @GetMapping
    public ResponseEntity<List<BudgetDTO>> getAllBudgets() {
        return ResponseEntity.ok(budgetService.getAllBudgets());
    }
    
    @GetMapping("/period")
    public ResponseEntity<List<BudgetDTO>> getBudgetsByPeriod(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth period) {
        return ResponseEntity.ok(budgetService.getBudgetsByPeriod(period));
    }
    
    @GetMapping("/category/{categoryId}/period")
    public ResponseEntity<BudgetDTO> getBudgetForCategoryAndPeriod(
            @PathVariable String categoryId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth period) {
        BudgetDTO budget = budgetService.getBudgetForCategoryAndPeriod(categoryId, period);
        return budget != null ? ResponseEntity.ok(budget) : ResponseEntity.notFound().build();
    }
    
    @PostMapping("/process-recurring")
    public ResponseEntity<Void> processRecurringBudgets(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth targetPeriod) {
        budgetService.processRecurringBudgets(targetPeriod);
        return ResponseEntity.ok().build();
    }
}