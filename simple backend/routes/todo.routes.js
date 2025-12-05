import express from "express"
import { createTodo, deleteTodo, getAllTodos, updateTodo } from "../controllers/todo.controllers.js"

const router = express.Router()


router.post('/todos', createTodo)
router.get('/todos', getAllTodos)
router.patch('/todo/:id', updateTodo)
router.delete('/todo/:id', deleteTodo)


export default router


