@echo off
cd /d D:\my-files\coding-projects\vanilla-todo-app\backend\src
start http://localhost:8080 &
start java -cp ".;../libs/*" Main &
start python -m http.server 8080 --directory "D:\my-files\coding-projects\vanilla-todo-app\frontend" &
start "http://localhost:8080"
pause
