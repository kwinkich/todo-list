// VAR
let todoItems = [];
let todoInput = document.querySelector('.todo-input');
const completedTodosDiv = document.querySelector('.completed-todos');
const unCompletedTodosDiv = document.querySelector('.uncompleted-todo');

// Get todo list on first boot
window.onload = () => {
	let storageTodoItems = localStorage.getItem('todoItems')
	if (storageTodoItems !== null) {
		todoItems = JSON.parse(storageTodoItems)
	}
	render();
}

//Get the content typed into the input
todoInput.onkeyup = ((e) => {
	let value = e.target.value.replace(/^\s+/, "")
	if (value && e.keyCode === 13) {
		//Enter
		addTodo(value)

		todoInput.value = ''
		todoInput.focus()
	}
})

// Add todo
function addTodo(text) {
	todoItems.push({
		id: Date.now(),
		text,
		completed: false
	})

	saveAndRender()
}

// Remove todo
function removeTodo(id) {
	todoItems = todoItems.filter(todo => todo.id !== Number(id))
	saveAndRender()
}

// Mark as completed
function markAsCompleted(id) {
	todoItems.forEach((todo) => {
		if (todo.id === Number(id)) {
			todo.completed = true;
		}
	});

	saveAndRender();
}

function markAsUncompleted(id) {
	todoItems.forEach((todo) => {
		if (todo.id === Number(id)) {
			todo.completed = false;
		}
	});

	saveAndRender();
}


// Save in localstorage
function save() {
	localStorage.setItem('todoItems', JSON.stringify(todoItems))
}

// Render
function render() {
	let unCompletedTodos = todoItems.filter(item => !item.completed)
	let completedTodos = todoItems.filter(item => item.completed)

	completedTodosDiv.innerHTML = ''
	unCompletedTodosDiv.innerHTML = ''

	if (unCompletedTodos.length > 0) {
		unCompletedTodos.forEach(todo => {
			unCompletedTodosDiv.append(createTodoListItem(todo));
		})
	} else {
		unCompletedTodosDiv.innerHTML = `<div class = 'empty'> No uncompleted mission</div>`
	}

	if (completedTodos.length > 0) {
		completedTodosDiv.innerHTML = `<div class = 'completed-title'> Completed (${completedTodos.length} / ${todoItems.length})</div>`

		completedTodos.forEach((todo) => {
			completedTodosDiv.append(createTodoListItem(todo));
		});
	}
}

//Save and  render

function saveAndRender() {
	save()
	render()
}

// Create todo list item
function createTodoListItem(todo) {
	// Create todo list container
	const todoItemDiv = document.createElement('div');
	todoItemDiv.setAttribute('data-id', todo.id);
	todoItemDiv.className = 'todo-item'

	// Create todo item text
	const todoTextSpan = document.createElement('span')
	todoTextSpan.innerHTML = todo.text

	// Checkbox for list
	const todoInputCheckbox = document.createElement('input')
	todoInputCheckbox.type = 'checkbox';
	todoInputCheckbox.checked = todo.completed
	todoInputCheckbox.onclick = (e) => {
		let id = e.target.closest('.todo-item').dataset.id
		e.target.checked ? markAsCompleted(id) : markAsUncompleted(id)
	}

	// Deledet 
	const todoRemoveBtn = document.createElement('a')
	todoRemoveBtn.href = '#'
	todoRemoveBtn.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M18 6l-12 12"></path> <path d="M6 6l12 12"></path></svg>`
	todoRemoveBtn.onclick = (e) => {
		let id = e.target.closest('.todo-item').dataset.id
		removeTodo(id)
	}

	todoTextSpan.prepend(todoInputCheckbox)
	todoItemDiv.appendChild(todoTextSpan)
	todoItemDiv.appendChild(todoRemoveBtn)

	return todoItemDiv
}


