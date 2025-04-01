@echo off
cd /d D:\my-files\coding-projects\vanilla-todo-app\src\backend
start /b java -cp ".;libs/*" Main
start /b python -m http.server 8080 --directory "D:\my-files\coding-projects\vanilla-todo-app\src\frontend"
start "Todo App" "http://localhost:8080"

echo Todo app started.
pause >nul