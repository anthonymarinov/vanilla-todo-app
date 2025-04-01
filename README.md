# vanilla-todo-app
A simple CRUD to-do app with a REST API using no frameworks. \
\
**Front-End:** Typescript, HTML, CSS \
**Back-End:** Java \
**Database:** SQLite \
\
**To launch using the provided start batch script at ```path/to/vanilla-todo-app/start.bat```:**
- Open ```start.bat``` in a text editor and modify the ```basePath``` variable to match the location of ```/vanilla-todo-app``` on your system.
- Run ```start.bat``` (double click the file). The todo app will pop up in your browser (along with a cmd terminal).
- Close the cmd terminal to quit the app, and close the browser. The inputted todo's will be stored in the database.

**To launch manually (using Git Bash terminals):**
- Clone the repository to a specified location of your choice.
- Edit the path to the SQLite ```database.db``` file (located at ```path/to/vanilla-todo-app/database.db```) in the Java file at ```path/to/vanilla-todo-app/src/backend/DB.java``` to match the the path on your system.
- Recompile the Java files by running ```javac -cp ".;libs/*" *.java``` in a terminal in the ```path/to/vanilla-todo-app/src/backend``` directory.
- Launch the backend server by running ```java -cp ".;libs/*" Main``` in a terminal in the ```path/to/vanilla-todo-app/src/backend``` directory.
- Launch the frontend server (using a Python server in this case) in a new terminal by running ```python -m http.server 8080``` in the ```path/to/vanilla-todo-app/src/frontend``` directory.
- Navigate to ```localhost:8080``` in a browser to use the app.