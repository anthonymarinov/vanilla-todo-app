# vanilla-todo-app
A simple CRUD to-do app with a REST API using no frameworks. \
\
**Front-End:** Typescript, HTML, CSS \
**Back-End:** Java \
**Database:** SQLite \
\
To launch (using Git Bash terminal):
- Clone the repository to a specified location of your choice
- Edit the path to the SQLite ```database.db``` file (located at ```path/to/vanilla-todo-app/backend/database.db```) in the Java file at ```path/to/vanilla-todo-app/backend/src/DB.java``` to match the the path on your system
- Recompile the Java files by running ```javac *.java``` in the ```path/to/vanilla-todo-app/backend/src``` directory
- Launch the backend server by running ```java -cp ".;../libs/sqlite-jdbc-3.49.1.0.jar" Main``` in a terminal in the ```path/to/vanilla-todo-app/backend/src/``` directory
- Launch the frontend server (using a Python server in this case) in a new terminal by running ```python -m http.server 8080``` in the ```path/to/vanilla-todo-app/frontend/``` directory
- Navigate to ```localhost:8080``` in a browser to use the app