interface Todo {
    id: string;
    item: string;
}

const apiURL = "http://localhost:8000/todos";
const newTodoInput = document.querySelector(".add-todo input") as HTMLInputElement;
const addForm = document.querySelector(".add-todo") as HTMLFormElement;

async function getTodos() {
    try {
        const response = await fetch(apiURL);
        const todoList: Todo[] = await response.json();
        return todoList;
    } catch (error) {
        console.error(error);
    }
}

async function displayTodos() {
    const todoList = await getTodos();
    let todoContainer = document.querySelector("#todo-container") as HTMLDivElement;
    todoContainer.innerHTML = "";
    if (!todoList) {return;}
    if (todoList.length == 0) {
        todoContainer.innerHTML += `
                <div class="todo">
                    <span> No tasks to complete! </span>
                </div>
        `;
    } else {
        todoList.forEach((todo) => {
            todoContainer.innerHTML += `
                <div class="todo">
                    <span>${todo.item}</span>
                    <div class="actions">
                        <button class="edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete">
                            <i class="far fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    }
}

async function createTodo(data) {
    try {
        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log("success: ", result.message);
    } catch (error) {
        console.error(error);
    }
}

async function addTodo() {
    if (!newTodoInput) {return;}
    const data = { item: newTodoInput.value };
    await createTodo(data);
    displayTodos();
    newTodoInput.value = "";
}

addForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTodo();
});

displayTodos();