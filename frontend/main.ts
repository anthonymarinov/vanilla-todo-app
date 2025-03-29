interface Todo {
    id: string;
    item: string;
}

const apiURL = "http://localhost:8000/todos";

async function getTodos() {
    try {
        const response = await fetch(apiURL);
        const todoList: Todo[] = await response.json();
        return todoList;
    } catch (error) {
        console.log(error);
    }
}

async function displayTodos() {
    const todoList = await getTodos();
    let todoContainer = document.querySelector("#todo-container") as HTMLDivElement;
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

displayTodos();