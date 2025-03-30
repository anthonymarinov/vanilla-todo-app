interface Todo {
    id: string;
    item: string;
}

const apiURL = "http://localhost:8000/todos";
const newTodoInput = document.querySelector(".add-todo input") as HTMLInputElement;
const addForm = document.querySelector(".add-todo") as HTMLFormElement;
const addButton = document.querySelector(".add-button") as HTMLButtonElement;

let isEditingTask = false;
let editButtonTodoID = "";

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
    attachUpdateHandlers();
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

async function updateTodo(data, id: string) {
    try {
        const response = await fetch(`${apiURL}/${id}`, {
            method: "PUT",
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

function attachUpdateHandlers() {
    const updateButtons =
            document.querySelectorAll(".edit") as NodeListOf<HTMLButtonElement>;
    updateButtons.forEach((button) => {
        const parent = button.parentElement;
        if (!parent) return;
        const grandParent = parent.parentElement;
        if (!grandParent) return;

        const todoName = grandParent.children[0] as HTMLElement;

        button.addEventListener("click", () => {
            newTodoInput.value = todoName.innerText;
            addButton.innerHTML = "Save Edit";
            isEditingTask = true;
            if (!button.dataset.id) {
                console.error("Missing Todo ID");
                return;
            }
            editButtonTodoID = button.dataset.id;
        });
    })
}

async function editTodo() {
    const data = { item: newTodoInput.value };

    if (isEditingTask) await updateTodo(data, editButtonTodoID);
    displayTodos();

    newTodoInput.value = "";
    isEditingTask = false;
    addButton.innerHTML = "Add";
}

addForm.addEventListener("submit", (event) => {
    event.preventDefault();
    isEditingTask ? editTodo() : addTodo();
});

displayTodos();