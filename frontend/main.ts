const apiURL = "http://localhost:8000/todos";

async function fetchTodos() {
    const response = await fetch(apiURL);
    const todos = await response.json();
    const container = document.getElementById("todo-container");
    if (container) {
        container.innerHTML = "";
        todos.forEach((todo: any) => {
            const div = document.createElement("div");
            const updateButton = document.createElement("button");
            div.textContent = `• ${todo.item}`;
            updateButton.textContent = "Update";
            updateButton.id = "update-button";
            updateButton.type = "submit";
            div.appendChild(updateButton);
            div.id = "todo-text";
            container.appendChild(div);
        });
    }
}

async function createTodo(item: string) {
    const todo = { item };
    await fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(todo)
    });
    fetchTodos();
}

const form = document.getElementById("todo-form") as HTMLFormElement;
const todoContainer = document.getElementById("todo-container") as HTMLDivElement;

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const item = (document.getElementById("item") as HTMLInputElement).value;
    createTodo(item);
    form.reset();
});

fetchTodos();