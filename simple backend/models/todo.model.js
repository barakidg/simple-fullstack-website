import db from "../config/db.config.js"
import { DataTypes } from "sequelize"

const Todo = db.define('Todo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
    },

    content: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'content'
    },

    isDone: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_done'
    }
}, {
    tableName: "todos",
    freezeTableName: true
})

export default Todo