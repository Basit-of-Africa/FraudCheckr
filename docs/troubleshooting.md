# Troubleshooting Guide

Common issues and solutions for Nigeria's Fraud Conviction Records platform.

## Backend Issues

### Port 8000 Already in Use

**Error:**
```
Address already in use
```

**Solutions:**

1. Kill process using port 8000:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8000
kill -9 <PID>
```

2. Use different port:
```bash
uvicorn main:app --port 8001
```

### Module Not Found Error

**Error:**
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solutions:**

1. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

### "No conviction data loaded"

**Error:**
```
[LOAD] WARNING: CSV file not found
```

**Solutions:**

1. Ensure CSV file exists:
```bash
ls data/convictions.csv
```

2. File should be in project root:
```
c:\Users\USER\efcc-convictions-explorer\data/convictions.csv
```

3. Check file permissions - file must be readable

4. Verify CSV format with headers:
```
name,offense,prison_term,fine,restitution,court
```

### Pandas Import Error

**Error:**
```
ImportError: cannot import name 'DataFrame' from 'pandas'
```

**Solution:**
```bash
pip install --upgrade pandas
pip install -r requirements.txt
```

### Pydantic Validation Error

**Error:**
```
ValidationError: Input should be a valid string
```

**Solution:**
This usually means NaN values from CSV. Run:
```bash
python scripts/build_dataset.py
```

## Frontend Issues

### Port 3000 Already in Use

**Error:**
```
Port 3000 is already in use
```

**Solutions:**

1. Kill process:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

2. Use different port:
```bash
npm run dev -- --port 3001
```

### npm Module Not Found

**Error:**
```
npm: command not found
```

**Solution:**

1. Install Node.js from [nodejs.org](https://nodejs.org)
2. Verify installation:
```bash
node --version
npm --version
```

### Dependencies Installation Fails

**Error:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve dependency peer
```

**Solutions:**

1. Clear npm cache:
```bash
npm cache clean --force
```

2. Delete and reinstall:
```bash
rm -r node_modules package-lock.json
npm install
```

3. Force legacy peer deps:
```bash
npm install --legacy-peer-deps
```

### Build Fails

**Error:**
```
vite build fails with module resolution error
```

**Solutions:**

1. Check import paths are correct
2. Ensure all files exist
3. Clear Vite cache:
```bash
rm -r .vite
npm run build
```

## API Connection Issues

### Frontend Can't Connect to Backend

**Error:**
```
ERR_CONNECTION_REFUSED
```

**Checklist:**

1. ✅ Backend running on port 8000?
```bash
curl http://localhost:8000/
```

2. ✅ Frontend running on port 3000?
```bash
curl http://localhost:3000/
```

3. ✅ CORS enabled? Update `main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

4. ✅ Vite proxy configured? Check `vite.config.js`:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  }
}
```

### API Returns 500 Error

**Error:**
```
500 Internal Server Error
```

**Debug:**

1. Check backend console for error message
2. Verify data file exists and is readable
3. Check Python version >= 3.10
4. Reinstall dependencies:
```bash
pip install --upgrade -r requirements.txt
```

## Data Issues

### Missing Records After Upload

**Cause:** Invalid CSV format or missing required columns

**Solution:**

1. Verify CSV has required columns:
```
name, offense, prison_term, fine, restitution, court
```

2. Run transformation:
```bash
python scripts/build_dataset.py
```

3. Check transform output for record count

### Blank/Empty Results

**Checklist:**

1. Verify CSV file has data rows (not just headers)
2. Check data file size:
```bash
ls -lh data/convictions.csv
```

3. Preview data:
```bash
head -5 data/convictions.csv
```

## Testing Issues

### Tests Fail

**Command:**
```bash
python test_api.py
```

**Solutions:**

1. Ensure backend is NOT running before tests
2. Verify data file exists
3. Check port 8000 is free
4. Reinstall test dependencies:
```bash
pip install requests
```

## Git/Version Control Issues

### Git Remote Not Set

**Error:**
```
fatal: No remote repository specified
```

**Solution:**
```bash
git remote add origin https://github.com/yourusername/efcc-convictions-explorer.git
git branch -M main
git push -u origin main
```

### Git Merge Conflicts

**Solution:**

1. Identify conflicted files
2. Edit files to resolve conflicts
3. Stage and commit:
```bash
git add .
git commit -m "Resolve merge conflicts"
```

## Performance Issues

### Slow Page Load

**Solutions:**

1. Check pagination - load only 20 records per page
2. Optimize browser performance:
   - Clear cache
   - Disable extensions
   - Use incognito mode

3. Monitor network:
   - Open DevTools (F12)
   - Check Network tab
   - Verify API response times

### High CPU Usage

**Solutions:**

1. Check for infinite loops in components
2. Verify pagination is working
3. Monitor React with React DevTools

## Getting Help

When reporting issues, include:

1. **Error message** - Exact error text
2. **Steps to reproduce** - How to recreate issue
3. **System info** - OS, Python/Node version
4. **Logs** - Terminal output
5. **Screenshots** - If applicable

## Additional Resources

- [Documentation](../README.md)
- [FAQ](../faq.md)
- [GitHub Issues](https://github.com/yourusername/efcc-convictions-explorer/issues)

---

**Documentation Version**: 1.0.0  
**Last Updated**: March 30, 2026
