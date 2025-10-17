package com.expense.api.service;

import com.expense.api.dto.CategoryDTO;
import java.time.YearMonth;
import java.util.List;

public interface CategoryService {
    CategoryDTO createCategory(CategoryDTO category);
    CategoryDTO updateCategory(String id, CategoryDTO category);
    void deleteCategory(String id);
    CategoryDTO getCategory(String id);
    List<CategoryDTO> getAllCategories();
    List<CategoryDTO> getCategoriesWithStats(YearMonth period);
}