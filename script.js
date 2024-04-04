
        document.addEventListener("DOMContentLoaded", function () {
            const taskInput = document.getElementById("taskInput");
            const startTimeInput = document.getElementById("startTimeInput");
            const endTimeInput = document.getElementById("endTimeInput");
            const taskList = document.getElementById("taskList");


            loadTasks();

            // Event listener for adding a new task
            taskInput.addEventListener("keypress", function (event) {
                if (event.key === "Enter") {
                    const taskText = taskInput.value;
                    const startTime = startTimeInput.value;
                    const endTime = endTimeInput.value;
                    addTask(taskText, startTime, endTime);
                    taskInput.value = "";
                    startTimeInput.value = "";
                    endTimeInput.value = "";
                }
            });

            // Function to add a new task
            function addTask(taskText, startTime, endTime) {
                if (taskText.trim() !== "") {
                    const li = document.createElement("li");
                    const taskDescription = document.createElement("span");
                    taskDescription.textContent = taskText;
                    const taskInfo = document.createElement("div");
                    taskInfo.textContent = getFormattedDateTime(startTime, endTime);
                    const editBtn = createButton("Edit", "edit-btn");
                    const priorityBtn = createButton("Priority", "priority-btn");
                    const deleteBtn = createButton("Delete", "delete-btn");
                    const completeBtn = createButton("Complete", "complete-btn");

                    editBtn.onclick = function () {
                        const newText = prompt("Edit the task:", taskDescription.textContent);
                        if (newText !== null && newText.trim() !== "") {
                            taskDescription.textContent = newText;
                            taskInfo.textContent = getFormattedDateTime(startTime, endTime);
                            saveTasks();
                        }
                    };

                    priorityBtn.onclick = function () {
                        li.classList.toggle("priority");
                        saveTasks();
                    };

                    deleteBtn.onclick = function () {
                        taskList.removeChild(li);
                        saveTasks();
                    };

                    completeBtn.onclick = function () {
                        li.classList.toggle("completed");
                        saveTasks();
                    };

                    li.appendChild(taskDescription);
                    li.appendChild(taskInfo);
                    li.appendChild(editBtn);
                    li.appendChild(priorityBtn);
                    li.appendChild(deleteBtn);
                    li.appendChild(completeBtn);
                    li.setAttribute("data-start-time", startTime);
                    li.setAttribute("data-end-time", endTime);

                    taskList.appendChild(li);
                    saveTasks();
                }
            }



            function createButton(text, className) {
                const button = document.createElement("button");
                button.textContent = text;
                button.classList.add(className);
                return button;
            }

            // Function to save tasks to local storage
            function saveTasks() {
                const tasks = [];
                const taskItems = taskList.querySelectorAll("li");
                taskItems.forEach(function (task) {
                    const taskDescription = task.querySelector("span").textContent;
                    const taskPriority = task.classList.contains("priority");
                    const taskCompleted = task.classList.contains("completed");
                    const taskStartTime = task.getAttribute("data-start-time");
                    const taskEndTime = task.getAttribute("data-end-time");
                    tasks.push({ description: taskDescription, priority: taskPriority, completed: taskCompleted, startTime: taskStartTime, endTime: taskEndTime });
                });
                localStorage.setItem("tasks", JSON.stringify(tasks));
            }


            // Function to load tasks from local storage
            function loadTasks() {
                const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
                tasks.forEach(function (task) {
                    addTask(task.description, task.startTime, task.endTime);
                    const taskItems = taskList.querySelectorAll("li");
                    const latestTask = taskItems[taskItems.length - 1];
                    if (task.priority) {
                        latestTask.classList.add("priority");
                    }
                    if (task.completed) {
                        latestTask.classList.add("completed");
                    }
                });
            }


            // Function to get formatted date and time
            function getFormattedDateTime(startTime, endTime) {
                const now = new Date();
                const date = now.toLocaleDateString();
                return `Added: ${date} | Start: ${startTime} | End: ${endTime}`;
            }

            // Function to validate time format
            // function isValidTime(time) {
            //     return /^((1[0-2]|0?[1-9]):([0-5][0-9]))$/.test(time);
            // }
        });
    