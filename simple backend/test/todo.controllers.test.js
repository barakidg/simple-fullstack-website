import { vi, describe, it, expect, beforeEach } from 'vitest'
// This import is safe now that the mocking mechanism has been registered below.
import { createTodo, getAllTodos, updateTodo, deleteTodo } from '../controllers/todo.controllers.js'

// 1. Define the individual spy functions (These are defined using 'const')
const createMock = vi.fn()
const findAllMock = vi.fn()
const updateMock = vi.fn()
const destroyMock = vi.fn()

// 2. Intercept the import, using GETTERS to delay access to the spies
// This prevents the "Cannot access 'createMock' before initialization" error.
vi.mock('../models/todo.model.js', () => ({
    // Use 'get' on the properties. This means 'createMock' is only read 
    // when Todo.create() is called inside a test, not when the mock is hoisted.
    default: {
        get create() { return createMock },
        get findAll() { return findAllMock },
        get update() { return updateMock },
        get destroy() { return destroyMock },
    }
}))


// Helper function to create mock Express request and response objects
const mockReqRes = (params = {}, body = {}) => {
    const req = {
        params,
        body
    }
    const res = {
        status: vi.fn(() => res),
        json: vi.fn(() => res)
    }
    return { req, res }
}


describe('Todo Controllers', () => {

    beforeEach(() => {
        // Reset the mock spies before each test
        vi.clearAllMocks()
    })

    // Test for POST /api/todos
    it('should create a new todo and return 201 status', async () => {
        const { req, res } = mockReqRes({}, { content: 'Test Todo Content' })

        createMock.mockResolvedValue({ id: 1, content: 'Test Todo Content' })

        await createTodo(req, res)

        // Use the individual spy function for assertion
        expect(createMock).toHaveBeenCalledWith({ content: 'Test Todo Content' })

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Todo created successfully'
        })
    })

    // Test for GET /api/todos
    it('should fetch all todos and return 200 status', async () => {
        const mockTodos = [
            { id: 1, content: 'T1', isDone: false },
            { id: 2, content: 'T2', isDone: true }
        ]
        const { req, res } = mockReqRes()

        findAllMock.mockResolvedValue(mockTodos)

        await getAllTodos(req, res)

        expect(findAllMock).toHaveBeenCalledWith()

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Todos fetched successfully',
            data: mockTodos
        })
    })

    // Test for PATCH /api/todo/:id
    it('should update a todo status and return 200 status', async () => {
        const { req, res } = mockReqRes({ id: '1' }, { isDone: true })

        updateMock.mockResolvedValue([1]) // [affectedRows]

        await updateTodo(req, res)

        expect(updateMock).toHaveBeenCalledWith(
            { isDone: true },
            { where: { id: '1' } }
        )

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Todo updated successfully'
        })
    })

    // Test for DELETE /api/todo/:id
    it('should delete a todo and return 200 status', async () => {
        const { req, res } = mockReqRes({ id: '1' })

        destroyMock.mockResolvedValue(1) // number of destroyed rows

        await deleteTodo(req, res)

        expect(destroyMock).toHaveBeenCalledWith({ where: { id: '1' } })

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Todo deleted successfully'
        })
    })
})