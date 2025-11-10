document.addEventListener("DOMContentLoaded", () => {
  // Ensure DOM is loaded
  const todoInput = document.getElementById("todo-input");
  const addTaskButton = document.getElementById("add-task-btn");
  const todoList = document.getElementById("todo-list");

  // Load tasks from localStorage or initialize empty array
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Render existing tasks
  tasks.forEach((task) => renderTask(task));

  // Function to add a new task
  function addTask() {
    const taskText = todoInput.value.trim();
    if (taskText === "") return;

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };
    tasks.push(newTask);
    saveTasks();
    renderTask(newTask);
    todoInput.value = ""; //clear input
    // console.log(tasks); // Debugging line to check tasks array
  }

  // Event listeners for adding tasks on button click
  addTaskButton.addEventListener("click", () => {
    addTask();
  });

  // Event listener for adding tasks on Enter key press
  todoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent form submit if inside <form>
      addTask();
    }
  });

  // Function to render a task in the DOM
  function renderTask(task) {
    const li = document.createElement("li"); // Create list item
    li.setAttribute("data-id", task.id); // Set data-id attribute
    if (task.completed) li.classList.add("completed"); // Mark completed tasks
    const span = document.createElement("span"); // Create span for task text
    span.textContent = task.text; // Set task text
    const button = document.createElement("button"); // Create delete button
    button.textContent = "Delete"; // Set button text
    li.append(span, button); // Append span and button to list item

    // Event listener for toggling task completion
    li.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") return;
      task.completed = !task.completed;
      li.classList.toggle("completed");
      saveTasks();
    });

    li.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation(); //prevent toggle from firing
      li.classList.add("remove");
      li.addEventListener( // It ensures the task is removed after the transition
        "transitionend",
        () => {
          tasks = tasks.filter((t) => t.id !== task.id); // Remove task from array
          li.remove();
          saveTasks();
        },
        { once: true } // Ensure listener is removed after execution
      );
    });

    todoList.appendChild(li); // Append list item to todo list
  }

  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});
