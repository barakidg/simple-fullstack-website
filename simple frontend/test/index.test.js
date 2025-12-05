import { vi, describe, it, expect, beforeEach } from 'vitest'
import { JSDOM } from 'jsdom'

// Mock the entire index.js by loading it into the JSDOM environment
// Note: In a real Vitest setup, you'd use the test environment flag, 
// but for a standalone file, JSDOM setup is cleaner.

// Setup JSDOM environment
const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
    <body>
        <div id="app">
            <button id="add-todo">Add</button>
            <form id="todo-form" class="todo-form">
                <input type="text" id="todo-input">
                <button id="post-todo">Add</button>
                <p id="notify"></p>
            </form>
            <div class="todo-list"></div>
        </div>
        <script src="../index.js"></script>
    </body>
    </html>
`, { runScripts: "dangerously", resources: "usable" })

global.document = dom.window.document
global.window = dom.window
global.HTMLElement = dom.window.HTMLElement
global.fetch = vi.fn() // Mock the global fetch function
// Import the functions after setting up the DOM
const { createTodo, getTodos, updateTodo, deleteTodo, displayTodos } = await import('../index.js')


describe('Frontend Todo App Logic', () => {

    // Helper to reset DOM before each test
    beforeEach(() => {
        document.querySelector('.todo-list').innerHTML = ''
        document.getElementById('todo-input').value = ''
        document.getElementById('notify').textContent = ''
        vi.clearAllMocks()
    })

    // --- Test: displayTodos (Pure Function) ---
    it('should correctly render todos in the list, including done status', () => {
        const mockTodos = [
            { id: 1, content: 'Buy groceries', isDone: false },
            { id: 2, content: 'Clean house', isDone: true },
        ]

        displayTodos(mockTodos)

        const listItems = document.querySelectorAll('.todo-item')

        expect(listItems.length).toBe(2)

        // Check first item (not done)
        expect(listItems[0].textContent).toContain('Buy groceries')
        expect(listItems[0].classList.contains('done')).toBe(false)
        expect(listItems[0].querySelector('.done-btn').textContent).toBe('Mark as Done')

        // Check second item (done)
        expect(listItems[1].textContent).toContain('Clean house (Done)')
        expect(listItems[1].classList.contains('done')).toBe(true)
        // Check if Mark as Done button is not rendered when done (based on your implementation)
        expect(listItems[1].querySelector('.done-btn')).toBeNull()
    })


    // --- Test: createTodo (API Interaction) ---
    it('should call fetch with POST method and correct body', async () => {
        document.getElementById('todo-input').value = 'New Test Task'

        // Mock a successful fetch response
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true, message: 'Todo created successfully' }),
        })

        await createTodo()

        // Check if fetch was called
        expect(global.fetch).toHaveBeenCalledTimes(1)

        // Check if fetch was called with the correct method and body
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3000/api/todos',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ content: 'New Test Task' }),
            })
        )

        // Check if the input was cleared
        expect(document.getElementById('todo-input').value).toBe('')

        // Check if notification was set
        expect(document.getElementById('notify').textContent).toBe('Todo created successfully')
    })


    // --- Test: updateTodo (API Interaction) ---
    it('should call fetch with PATCH method and correct body for updating', async () => {
        // Mock a successful fetch response (also mocks getTodos call inside updateTodo)
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ success: true, data: [] }),
        })

        await updateTodo(5, false) // Call update with id 5, setting isDone to false

        // First call is updateTodo, second is getTodos
        expect(global.fetch).toHaveBeenCalledTimes(2)

        // Check the updateTodo call details
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3000/api/todo/5',
            expect.objectContaining({
                method: 'PATCH',
                body: JSON.stringify({ isDone: false }),
            })
        )
    })

    // --- Test: deleteTodo (API Interaction) ---
    it('should call fetch with DELETE method', async () => {
        // Mock a successful fetch response
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ success: true, data: [] }),
        })

        await deleteTodo(10) // Call delete with id 10

        // First call is deleteTodo, second is getTodos
        expect(global.fetch).toHaveBeenCalledTimes(2)

        // Check the deleteTodo call details
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:3000/api/todo/10',
            expect.objectContaining({
                method: 'DELETE',
            })
        )
    })
})