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
                <div class="todo" data-id="${todo.id}">
                    <span>${todo.item}</span>
                    <div class="actions">
                        <button class="edit" data-id="${todo.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete" data-id="${todo.id}">
                            <i class="far fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    }
    attachDeleteHandlers();
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

async function deleteTodo(id: string) {
    try {
        const response = await fetch(`${apiURL}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "applications/json",
            },
        });
        const result = await response.json();
        console.log("success: ", result.message);
        displayTodos();
    } catch (error) {
        console.error(error);
    }
}

function attachDeleteHandlers() {
    const deleteButtons = 
            document.querySelectorAll('.delete') as NodeListOf<HTMLButtonElement>;
    deleteButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            if (id) {
                deleteTodo(id);
            }
        });
    });
}

addForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTodo();
});

displayTodos();