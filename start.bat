@echo off

REM Edit this path to the location of vanilla-todo-app on your system
set basePath=D:\my-files\coding-projects\vanilla-todo-app

set backendPath=\src\backend
set frontendPath=\src\frontend
set fullBackendPath=%basePath%%backendPath%
set fullFrontendPath=%basePath%%frontendPath%
cd /d %fullBackendPath%
start /b java -cp ".;libs/*" Main
start /b python -m http.server 8080 --directory %fullFrontendPath%
start "Todo App" "http://localhost:8080"

echo Todo app started.
pause >nul