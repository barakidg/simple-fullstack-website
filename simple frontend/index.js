document.addEventListener('DOMContentLoaded', () => {
    const addTodoButton = document.getElementById('add-todo')
    const todoForm = document.getElementById('todo-form')
    const postTodoButton = document.getElementById('post-todo')
    const todoListContainer = document.querySelector('.todo-list')

    addTodoButton.addEventListener('click', () => {
        todoForm.classList.toggle('active-form')
    })

    postTodoButton.addEventListener('click', async (e) => {
        e.preventDefault()
        await createTodo()
    })

    todoListContainer.addEventListener('click', async (e) => {
        const todoId = e.target.getAttribute('data-todo-id')
        if (!todoId) return

        if (e.target.classList.contains('delete-btn')) {
            await deleteTodo(todoId)
        } else if (e.target.classList.contains('done-btn')) {
            await updateTodo(todoId)
        }
    })

    getTodos()
})


async function createTodo() {
    const todoInput = document.getElementById('todo-input')
    const todoContent = todoInput.value.trim()
    const notify = document.getElementById('notify')
    notify.textContent = ''

    if (!todoContent) return

    try {
        const response = await fetch('https://todo-backend-api-u5o1.onrender.com/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: todoContent })
        })

        const data = await response.json()
        if (response.ok) {
            notify.textContent = data.message
            todoInput.value = ''
            await getTodos()
        } else {
            notify.textContent = data.message || 'Error creating todo'
        }
    } catch (error) {
        notify.textContent = 'Network error while creating todo'
    }
}


async function getTodos() {
    try {
        const response = await fetch('https://todo-backend-api-u5o1.onrender.com/api/todos')
        const data = await response.json()
        if (response.ok && data.data) {
            displayTodos(data.data)
        }
    } catch (error) {
        console.log('error fetching todos')
    }
}


async function updateTodo(id) {
    try {
        const response = await fetch(`https://todo-backend-api-u5o1.onrender.com/api/todo/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isDone: true })
        })

        if (response.ok) {
            await getTodos()
        } else {
            console.log('Update failed')
        }
    } catch (error) {
        console.log('error updating todo: ', error)
    }
}


async function deleteTodo(id) {
    try {
        const response = await fetch(`https://todo-backend-api-u5o1.onrender.com/api/todo/${id}`, {
            method: 'DELETE'
        })

        if (response.ok) {
            await getTodos()
        } else {
            console.log('Delete failed')
        }
    } catch (error) {
        console.log('error deleting todo: ', error)
    }
}


function displayTodos(todos) {
    const todoListContainer = document.querySelector('.todo-list')
    todoListContainer.innerHTML = ''

    if (!Array.isArray(todos)) return

    todos.forEach(todo => {
        const todoItem = document.createElement('div')
        todoItem.className = `todo-item ${todo.isDone ? 'done' : ''}`

        const doneText = todo.isDone ? ' (Done)' : ''
        const buttonText = todo.isDone ? '' : 'Mark as Done'

        todoItem.innerHTML = `
            <p>${todo.content}${doneText}</p>
            <div class="actions">
                ${buttonText ? `<button class="done-btn" data-todo-id="${todo.id}">${buttonText}</button>` : ""}
                <button class="delete-btn" data-todo-id="${todo.id}">Delete</button>
            </div>
        `
        todoListContainer.appendChild(todoItem)
    })
}