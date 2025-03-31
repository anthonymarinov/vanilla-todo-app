@echo off
cd /d D:\my-files\coding-projects\vanilla-todo-app\backend\src
start http://localhost:8080 &
start /b java -cp ".;../libs/*" Main &
start /b python -m http.server 8080 --directory "D:\my-files\coding-projects\vanilla-todo-app\frontend"
pause
