//Variables
const taskInput = document.querySelector(".task-input input"),
    filters = document.querySelectorAll(".filters span"),
    clearAll = document.querySelector(".clear-btn"),
    taskBox = document.querySelector(".task-box");

let editId;
let isEditable = false;

let todos = JSON.parse(localStorage.getItem("todo-list"));


// Adding event listener
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();

    if (e.key == "Enter" && userTask) {

        if (!isEditable) {

            if (!todos) {
                todos = [];
            }
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo);
        } else {
            isEditable = false;
            todos[editId].name = userTask;

        }


        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));

        // calling showTodoList function
        showTodoList("all");
    }
})

// function to create todo list dynamic
function showTodoList(filter) {
    let liTag = "";
    if (todos) {
        todos.forEach((todo, id) => {

            //Turnery operator
            let isCompleted = todo.status == "completed" ? "checked" : "";

            if (filter == todo.status || filter == "all") {

                //(``) <= tamplate literals
                liTag += `
                    <li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" 
                                ${isCompleted}  />
                                <p class="${isCompleted}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick='editTask(${id}, "${todo.name}")'>
                                    <i class="uil uil-pen"></i>Edit</li>
    
                                    <li onclick='deleteTask(${id}, "${filter}")'>
                                    <i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>
                `;
            }


        });
    }

    taskBox.innerHTML = liTag || `<span> No task is added </span>`;

}
showTodoList("all");

// creating update status function
function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

// creating show menu function
function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");

    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    })
}

// function to delete task
function deleteTask(deleteId, filter) {
    //Removing selected task todos/arr
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodoList(filter);
}

// function to edit any previous task
function editTask(taskId, taskName) {
    editId = taskId;
    isEditable = true;
    taskInput.value = taskName;
}


// filter function 
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodoList(btn.id);
    })
})

// function to clear all tasks from list
clearAll.addEventListener("click", () => {
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodoList("all");
})

