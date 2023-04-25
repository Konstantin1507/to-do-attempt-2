const root = document.getElementById('root');

//HEADER
let header = document.createElement('h1');
header.textContent = 'todos';
header.classList.add('header');
root.append(header);

//MAIN SECTION
const main = document.createElement('section');
main.id = 'main';
root.append(main);

//FOOTER
const footer = document.createElement('footer');
footer.classList.add('footer');
root.append(footer);

const p1 = document.createElement('p');
p1.innerHTML = 'Double-click to edit a todo';
footer.append(p1);

const p2 = document.createElement('p');
p2.innerHTML = 'Written by TasteJS';
footer.append(p2);

const p3 = document.createElement('p');
p3.innerHTML = 'Part of TodoMVC';
footer.append(p3);

//creating ARRAY of tasks
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

//INPUT

//todo input div
const todoInputHolder = document.createElement('div');
todoInputHolder.id = 'todoInputHolder';
main.append(todoInputHolder);

// todo input label + checkbox
const inputLabel = document.createElement('label');
inputLabel.innerHTML = 'V';
inputLabel.classList.add('inputLabel');
todoInputHolder.append(inputLabel);
const inputCheckbox = document.createElement('input');
inputCheckbox.type = 'checkbox';
inputCheckbox.classList.add('checkbox');
inputLabel.append(inputCheckbox);
if (tasks.length === 0) {
  inputLabel.classList.add('none');
}
isAllChecked();

//todo input
const todoInput = document.createElement('input');
todoInput.type = 'text';
todoInput.id = 'todoInput';
todoInput.classList.add('todo-validate-input');

todoInput.setAttribute('placeholder', 'What needs to be done?');
todoInputHolder.append(todoInput);

//UL - list
const listElem = document.createElement('ul');
listElem.id = 'listElem';
main.append(listElem);

function showHideControle() {
  if (tasks.length !== 0) {
    control.classList.remove('hidden');
  } else {
    control.classList.add('hidden');
  }
}

//CONTROL - bottoms
const control = document.createElement('div');
control.classList.add('control');
showHideControle();
main.append(control);

//items left
const remain = document.createElement('div');
control.append(remain);
const remainNumber = document.createElement('span');
remainNumber.id = 'remainNumber';
remainNumber.innerHTML = 0;
remain.append(remainNumber);
const remainText = document.createElement('span');
remainText.innerHTML = ' items left';
remain.append(remainText);

//buttons
const buttons = document.createElement('ul');
buttons.id = 'buttons';
control.append(buttons);

const li1 = document.createElement('li');
buttons.append(li1);
const allTasks = document.createElement('button');
allTasks.id = 'all';
allTasks.classList.add('control-button');
allTasks.classList.add('activeButton');
allTasks.innerHTML = 'All';
li1.append(allTasks);

const li2 = document.createElement('li');
buttons.append(li2);
const activeTasks = document.createElement('button');
activeTasks.id = 'active';
activeTasks.classList.add('control-button');
activeTasks.innerHTML = 'Active';
li2.append(activeTasks);

const li3 = document.createElement('li');
buttons.append(li3);
const completedTasks = document.createElement('button');
completedTasks.id = 'completed';
completedTasks.classList.add('control-button');
completedTasks.innerHTML = 'Completed';
li3.append(completedTasks);

//clearCompleted
const clearCompletedDiv = document.createElement('div');
clearCompletedDiv.id = 'clearCompletedDiv';
control.append(clearCompletedDiv);

const clearCompleted = document.createElement('button');
clearCompleted.id = 'clearCompleted';
clearCompleted.innerHTML = 'Clear completed';
clearCompletedDiv.append(clearCompleted);

//FILLING ARRAY of tasks
if (localStorage.getItem('tasks')) {
  tasks.map((task) => {
    createNewTask(task);
  });
}
console.log(tasks);

//isAllChecked
function isAllChecked() {
  const doneTasks = tasks.filter((task) => task.isDone === true);
  if (tasks.length === doneTasks.length && tasks.length > 0) {
    inputLabel.classList.add('all-checked');
  } else {
    inputLabel.classList.remove('all-checked');
  }
}

//input handler
todoInput.addEventListener('keypress', function (event) {
  if (event.keyCode === 13) {
    if (todoInput.value == '') {
      return;
    }

    const task = {
      id: new Date().getTime(),
      name: todoInput.value,
      isDone: false,
    };

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    createNewTask(task);

    todoInput.value = '';
  }
});

// CREATE a NEW TASK
//li
function createNewTask(task) {
  const newElem = document.createElement('li');
  newElem.classList.add('listElem-li');
  newElem.id = task.id;
  listElem.append(newElem);
  //div
  const divElem = document.createElement('div');
  divElem.classList.add('listElem-div');
  newElem.append(divElem);
  //label + checkbox
  const label = document.createElement('label');
  label.innerHTML = 'V';
  label.classList.add('label');
  divElem.append(label);
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('checkbox');
  checkbox.classList.add('task-checkbox');
  label.append(checkbox);
  if (task.isDone === true) {
    checkbox.setAttribute('checked', '');
    checkbox.parentElement.classList.add('label-checked');
  }
  //span
  const taskName = document.createElement('span');
  taskName.classList.add('task');
  taskName.innerHTML = task.name;
  divElem.append(taskName);
  if (task.isDone) {
    taskName.classList.add('done');
  }
  //delete button
  const delBtn = document.createElement('button');
  delBtn.classList.add('delete');
  delBtn.innerHTML = 'X';
  divElem.append(delBtn);

  showHideControle();
  showItemsLeft();
  inputLabel.classList.remove('none');
  isAllChecked();
}

//ИЗМЕНЕНИЕ СТАТУСА INPUT CHECKBOX and all checkboxes
inputCheckbox.addEventListener('click', function () {
  let allCheckBoxes = document.querySelectorAll('.task-checkbox');

  for (let checkBox of allCheckBoxes) {
    const taskId = checkBox.closest('li').id;
    changeTaskStatus(taskId, checkBox);
  }
});

//РЕДАКТИРОВАНИЕ ТАСКИ
listElem.addEventListener('dblclick', function reduct() {
  if (event.target.classList.contains('task')) {
    let taskName = event.target;
    taskName.setAttribute('contentEditable', true);
    taskName.classList.add('task-focus');
    const taskId = event.target.closest('li').id;

    //убрать  x
    taskName.nextElementSibling.classList.add('none');

    //saveChanges
    function saveChanges() {
      taskName.removeAttribute('contentEditable');
      taskName.classList.remove('task-focus');
      //вернуть x
      taskName.nextElementSibling.classList.remove('none');
      changeTask(taskId, event.target);
    }

    //обработчик BLUR
    taskName.addEventListener('blur', saveChanges);

    //обработчик keypress ENTER
    taskName.addEventListener('keypress', function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        saveChanges();
      }
    });
  }
});

function changeTask(taskId, elem) {
  const task = tasks.find((task) => task.id === parseInt(taskId));

  task.name = elem.innerHTML;

  localStorage.setItem('tasks', JSON.stringify(tasks));
  showItemsLeft();
  showClearCompleted();
}

//ИЗМЕНЕНИЕ КЛАССА delete
listElem.addEventListener('mouseover', (event) => {
  let target = event.target.closest('div');
  if (target) {
    target.lastElementChild.classList.add('showX');
  }
});
listElem.addEventListener('mouseout', (event) => {
  let target = event.target.closest('div');
  if (target) {
    target.lastElementChild.classList.remove('showX');
  }
});

listElem.addEventListener('mouseover', (event) => {
  if (event.target.classList.contains('delete')) {
    event.target.classList.add('showXFull');
  }
});

listElem.addEventListener('mouseout', (event) => {
  if (event.target.classList.contains('delete')) {
    event.target.classList.remove('showXFull');
  }
});
// УДАЛЕНИЕ ТАСКИ
listElem.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete')) {
    const taskId = event.target.closest('li').id;
    removeTask(taskId);
    isAllChecked();
  }
});

function removeTask(taskId) {
  tasks = tasks.filter((task) => task.id !== +taskId);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  document.getElementById(taskId).remove();
  showHideControle();
  showClearCompleted();
  showItemsLeft();
  if (tasks.length === 0) {
    inputLabel.classList.add('none');
  }
}

//ИЗМЕНЕНИЕ АКТИВОСТИ КНОПКИ
buttons.addEventListener('click', function () {
  const buttons = document.querySelectorAll('.control-button');

  for (let button of buttons) {
    if (button === event.target) {
      button.classList.add('activeButton');
    } else {
      button.classList.remove('activeButton');
    }
  }
});

//ИЗМЕНЕНИЕ СТАТУСА
listElem.addEventListener('click', (event) => {
  if (event.target.classList.contains('checkbox')) {
    const taskId = event.target.closest('li').id;
    changeTaskStatus(taskId, event.target);
  }
});

function changeTaskStatus(taskId, elem) {
  let label = elem.parentElement;
  const span = label.nextElementSibling;

  const task = tasks.find((task) => task.id === parseInt(taskId));
  if (event.target.checked) {
    task.isDone = true;
    span.classList.add('done');
    label.classList.add('label-checked');
  } else if (event.target.checked == false) {
    task.isDone = false;
    span.classList.remove('done');
    label.classList.remove('label-checked');
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  showItemsLeft();
  showClearCompleted();
  isAllChecked();
}

//itemsLeft
function showItemsLeft() {
  const doneTasks = tasks.filter((task) => task.isDone === true);
  remainNumber.innerHTML = tasks.length - doneTasks.length;
}

//clearCompleted
clearCompleted.addEventListener('click', function () {
  tasks = tasks.filter((task) => {
    if (task.isDone !== true) {
      return true;
    } else {
      const taskId = task.id;
      document.getElementById(taskId).remove();
      return false;
    }
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  showHideControle();
  showClearCompleted();
  if (tasks.length === 0) {
    inputLabel.classList.add('none');
  }
});

//showClearCompleted
function showClearCompleted() {
  const doneTasks = tasks.filter((task) => task.isDone === true);
  if (doneTasks.length === 0) {
    clearCompleted.classList.add('hidden');
    clearCompleted.innerHTML = '';
  } else {
    clearCompleted.innerHTML = 'Clear completed';
    clearCompleted.classList.remove('hidden');
  }
}

//completedTasks
completedTasks.addEventListener('click', function () {
  tasks = tasks.filter((task) => {
    const taskId = task.id;
    if (task.isDone !== true) {
      document.getElementById(taskId).classList.add('none');
      return true;
    } else {
      document.getElementById(taskId).classList.remove('none');
      return true;
    }
  });
});

//activeTasks
activeTasks.addEventListener('click', function () {
  tasks = tasks.filter((task) => {
    const taskId = task.id;
    if (task.isDone === true) {
      document.getElementById(taskId).classList.add('none');
      return true;
    } else {
      document.getElementById(taskId).classList.remove('none');
      return true;
    }
  });
});

//allTasks
allTasks.addEventListener('click', function () {
  tasks = tasks.filter((task) => {
    const taskId = task.id;
    if (document.getElementById(taskId).classList.contains('none')) {
      document.getElementById(taskId).classList.remove('none');
      return true;
    } else {
      return true;
    }
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
});
