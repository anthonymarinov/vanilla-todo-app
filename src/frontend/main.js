var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var apiURL = "http://localhost:8000/todos";
var newTodoInput = document.querySelector(".add-todo input");
var addForm = document.querySelector(".add-todo");
var addButton = document.querySelector(".add-button");
var isEditingTask = false;
var editButtonTodoID = "";
function getTodos() {
    return __awaiter(this, void 0, void 0, function () {
        var response, todoList, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(apiURL)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    todoList = _a.sent();
                    return [2 /*return*/, todoList];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function displayTodos() {
    return __awaiter(this, void 0, void 0, function () {
        var todoList, todoContainer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTodos()];
                case 1:
                    todoList = _a.sent();
                    todoContainer = document.querySelector("#todo-container");
                    todoContainer.innerHTML = "";
                    if (!todoList) {
                        return [2 /*return*/];
                    }
                    if (todoList.length == 0) {
                        todoContainer.innerHTML += "\n                <div class=\"todo\">\n                    <span> No tasks to complete! </span>\n                </div>\n        ";
                    }
                    else {
                        todoList.forEach(function (todo) {
                            todoContainer.innerHTML += "\n                <div class=\"todo\" data-id=\"".concat(todo.id, "\">\n                    <span>").concat(todo.item, "</span>\n                    <div class=\"actions\">\n                        <button class=\"edit\" data-id=\"").concat(todo.id, "\">\n                            <i class=\"fas fa-edit\"></i>\n                        </button>\n                        <button class=\"delete\" data-id=\"").concat(todo.id, "\">\n                            <i class=\"far fa-trash-alt\"></i>\n                        </button>\n                    </div>\n                </div>\n            ");
                        });
                    }
                    attachDeleteHandlers();
                    attachUpdateHandlers();
                    return [2 /*return*/];
            }
        });
    });
}
function createTodo(data) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(apiURL, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(data)
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    console.log("success: ", result.message);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error(error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function addTodo() {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!newTodoInput) {
                        return [2 /*return*/];
                    }
                    data = { item: newTodoInput.value };
                    return [4 /*yield*/, createTodo(data)];
                case 1:
                    _a.sent();
                    displayTodos();
                    newTodoInput.value = "";
                    return [2 /*return*/];
            }
        });
    });
}
function deleteTodo(id) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(apiURL, "/").concat(id), {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "applications/json",
                            },
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    console.log("success: ", result.message);
                    displayTodos();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error(error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function attachDeleteHandlers() {
    var deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var id = button.dataset.id;
            if (id) {
                deleteTodo(id);
            }
        });
    });
}
function updateTodo(data, id) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(apiURL, "/").concat(id), {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(data)
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    console.log("success: ", result.message);
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error(error_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function attachUpdateHandlers() {
    var updateButtons = document.querySelectorAll(".edit");
    updateButtons.forEach(function (button) {
        var parent = button.parentElement;
        if (!parent)
            return;
        var grandParent = parent.parentElement;
        if (!grandParent)
            return;
        var todoName = grandParent.children[0];
        button.addEventListener("click", function () {
            newTodoInput.value = todoName.innerText;
            addButton.innerHTML = "Save Edit";
            isEditingTask = true;
            if (!button.dataset.id) {
                console.error("Missing Todo ID");
                return;
            }
            editButtonTodoID = button.dataset.id;
        });
    });
}
function editTodo() {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = { item: newTodoInput.value };
                    if (!isEditingTask) return [3 /*break*/, 2];
                    return [4 /*yield*/, updateTodo(data, editButtonTodoID)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    displayTodos();
                    newTodoInput.value = "";
                    isEditingTask = false;
                    addButton.innerHTML = "Add";
                    return [2 /*return*/];
            }
        });
    });
}
addForm.addEventListener("submit", function (event) {
    event.preventDefault();
    isEditingTask ? editTodo() : addTodo();
});
displayTodos();
