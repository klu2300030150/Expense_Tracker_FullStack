package com.expense.api.service.impl;

import com.expense.api.dto.CategoryDTO;
import com.expense.api.model.Category;
import com.expense.api.repository.CategoryRepository;
import com.expense.api.service.CategoryService;
import com.expense.api.service.EntityMapperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.YearMonth;
import java.util.List;
import jakarta.persistence.EntityNotFoundException;

@Service
public class CategoryServiceImpl implements CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private EntityMapperService mapper;
    
    @Override
    @Transactional
    public CategoryDTO createCategory(CategoryDTO dto) {
        Category category = new Category();
        updateCategoryFromDTO(category, dto);
        category = categoryRepository.save(category);
        return mapper.toDTO(category, YearMonth.now());
    }
    
    @Override
    @Transactional
    public CategoryDTO updateCategory(String id, CategoryDTO dto) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        updateCategoryFromDTO(category, dto);
        category = categoryRepository.save(category);
        return mapper.toDTO(category, YearMonth.now());
    }
    
    @Override
    @Transactional
    public void deleteCategory(String id) {
        categoryRepository.deleteById(id);
    }
    
    @Override
    public CategoryDTO getCategory(String id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        return mapper.toDTO(category, YearMonth.now());
    }
    
    @Override
    public List<CategoryDTO> getAllCategories() {
        return mapper.toCategoryDTOs(categoryRepository.findAll(), YearMonth.now());
    }
    
    @Override
    public List<CategoryDTO> getCategoriesWithStats(YearMonth period) {
        return mapper.toCategoryDTOs(categoryRepository.findAll(), period);
    }
    
    private void updateCategoryFromDTO(Category category, CategoryDTO dto) {
        category.setName(dto.getName());
        category.setColor(dto.getColor());
        category.setIcon(dto.getIcon());
    }
}