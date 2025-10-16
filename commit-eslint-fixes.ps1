# Fix ESLint Issues - Commit Script

# Add all changes
git add -A

# Commit with descriptive message
git commit -m "Fix ESLint errors: exclude build artifacts and fix source code issues

- Configure ESLint to ignore dist/, target/, SpringBootApp/, ExpenseAPI/
- Fix unused variables in Dashboard, Login, Utilities components
- Fix missing dispatch in Dashboard component
- Add .eslintignore files for build artifact exclusion
- Update CI workflow to lint only src/ directory
- Add Node.js globals for environment variables

All source code ESLint errors fixed. CI should now pass."

# Push to GitHub
git push origin main

Write-Host "✅ Changes committed and pushed to GitHub!"
Write-Host "Check GitHub Actions: https://github.com/klu2300030150/ExpenseTracker/actions"
