let taskList = [];

addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

const loadTasks = () => {
  fetch("/tasks/get")
  .then(response => response.json())
  .then(data => {
    taskList = data;
    renderTasks(taskList);
  })
  .catch(error => {
    console.error("Error loading tasks:", error);
  });
}

addEventListener("load", loadTasks());

const renderTasks = (tasks) => {
  const taskList = document.querySelector("#task-list");
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const taskElement = document.createElement("li");
    taskElement.textContent = task.title;
    taskElement.id = "id-" + task.id;
    if(task.done){
      taskElement.classList.add("done");
    }
    const state = document.createElement("span");
    state.textContent = task.done ? "✅" : "❌";
    taskElement.appendChild(state);
    taskList.appendChild(taskElement);
  });
}

const updateTasksOnServer = (tasks) => {
  fetch("/tasks/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tasks),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to update tasks on server");
    }
  })
  .catch(error => {
    console.error("Error updating tasks on server:", error);
  });
};

const add = () => {
  const name = document.getElementById("task-name");
  if (name.value === "") {
    return;
  }
  const lastTaskId = taskList.length > 0 ? taskList[taskList.length - 1].id : 0;
  const newTask = {
    id: lastTaskId + 1,
    title: name.value,
    done: false
  };
  taskList.push(newTask);
  renderTasks(taskList);
  name.value = "";
  updateTasksOnServer(taskList);
}

const remove = (element) => {
  const taskId = parseInt(element.id.split("-")[1]);
  taskList = taskList.filter(t => t.id !== taskId);
  renderTasks(taskList);
  updateTasksOnServer(taskList);
}

const toggleDone = (element) => {
  const task = taskList.find(t => t.id === parseInt(element.id.split("-")[1]));
  task.done = !task.done;
  renderTasks(taskList);
  updateTasksOnServer(taskList);
};

const addButton = document.querySelector("#fab-add");

addButton.addEventListener("touchend", add);

let touchStartX = null;
let touchEndX = null;

const touchStart = (e) => {
  const element = e.target;
  element.dataset.touchStart = Date.now();
  touchStartX = e.touches[0].clientX;
};

const touchEnd = (e) => {
  const element = e.target;
  const touchStart = element.dataset.touchStart;
  const touchEnd = Date.now();
  const touchDuration = touchEnd - touchStart;
  
  if (touchDuration >= 2000) {
    toggleDone(element);
  }
  if (touchStartX !== null && touchEndX !== null) {
    const touchDistance = touchEndX - touchStartX;
    if (touchDistance < -50) {
      remove(element);
    } else {
      element.style.transform = 'none';
    }
  }
  touchStartX = null;
  touchEndX = null;
};

const touchMove = (e) => {
  const element = e.target;
  const touchCurrentX = e.touches[0].clientX;

  if (touchStartX !== null) {
    const touchDistance = touchCurrentX - touchStartX;
    if (touchDistance < -50) {
      element.style.transform = `translateX(${touchDistance}px)`;
    } else {
      element.style.transform = 'none';
    }
  }

  touchEndX = touchCurrentX;
};

const List = document.querySelector("#task-list");
List.addEventListener("touchstart", touchStart);
List.addEventListener("touchend", touchEnd);
List.addEventListener("touchmove", touchMove);