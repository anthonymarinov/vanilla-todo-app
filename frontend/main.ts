const apiURL = "http://localhost:8000/todos";

async function fetchTodos() {
    const response = await fetch(apiURL);
    const todos = await response.json();
    const container = document.getElementById("todo-container");
    if (container) {
        container.innerHTML = "";
        todos.forEach((todo: any) => {
            const div = document.createElement("div");
            div.textContent = `${todo.id}: ${todo.item} - ${todo.description} 
                    [${todo.completed ? "Done" : "Pending"}]`;
            container.appendChild(div);
        });
    }
}

const form = document.getElementById("todo-form") as HTMLFormElement;
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const item = (document.getElementById("item") as HTMLInputElement).value;
    const description = (document.getElementById("description") as HTMLInputElement).value;

    const todo = { item, description, completed: false };

    await fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(todo)
    });

    fetchTodos();
});

fetchTodos();