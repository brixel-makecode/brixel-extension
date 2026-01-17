@echo off
echo Initializing Git repository...
git init
if %errorlevel% neq 0 goto :error

echo Adding files...
git add .
if %errorlevel% neq 0 goto :error

echo Committing...
git commit -m "Initial commit: Integrated MakeCode extension with A.Display category"
if %errorlevel% neq 0 goto :error

echo Renaming branch to main...
git branch -M main
if %errorlevel% neq 0 goto :error

echo Adding remote origin...
git remote add origin https://github.com/brixel-makecode/brixel-extension.git
if %errorlevel% neq 0 (
    echo Remote might already exist, trying to set url...
    git remote set-url origin https://github.com/brixel-makecode/brixel-extension.git
)

echo Pushing to GitHub...
git push -u origin main
if %errorlevel% neq 0 goto :error

echo Success! Extension published.
pause
exit /b 0

:error
echo An error occurred. Please check the output above.
pause
exit /b 1
