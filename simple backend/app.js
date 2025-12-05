import express from "express"
import "dotenv/config"
import cors from "cors"

import todoRoutes from "./routes/todo.routes.js"

const PORT = process.env.PORT
const app = express()


app.use(cors())

// middlewares
app.use(express.json())

// routes
app.use('/api', todoRoutes)

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({
        success: false,
        message: 'sth went wrong. please try again'
    })
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})