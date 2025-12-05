import Todo from "../models/todo.model.js"


export const createTodo = async (req, res) => {
    const { content } = req.body
    await Todo.create({ content })
    res.status(201).json({
        success: true,
        message: "Todo created successfully"
    })
}

export const getAllTodos = async (req, res) => {
    const todos = await Todo.findAll()
    res.status(200).json({
        success: true,
        message: "Todos fetched successfully",
        data: todos
    })
}

export const updateTodo = async (req, res) => {
    const { id } = req.params
    const { isDone } = req.body
    await Todo.update({ isDone }, { where: { id } })
    res.status(200).json({
        success: true,
        message: "Todo updated successfully"
    })
}

export const deleteTodo = async (req, res) => {
    const { id } = req.params
    await Todo.destroy({ where: { id } })
    res.status(200).json({
        success: true,
        message: "Todo deleted successfully"
    })
}
