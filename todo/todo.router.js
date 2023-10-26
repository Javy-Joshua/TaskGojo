const express = require("express");
const middleware = require("./todo.middleware");
const controller = require("./todo.controller");
const globalmiddleware = require("../middleware/global.middleware");

const router = express.Router();

//using bearer token to protect todo route from unaunthenticated users
// router.use(globalmiddleware.bearerTokenAuth)

//create todo
router.post("/", middleware.validateTodoCreation, controller.CreateTodo);

// get todos
router.get("/", controller.GetAllTodo);

// get one todo
router.get("/:id", controller.GetTodo);

//update a task
router.post("/edit/:id", middleware.validateTodoCreation, controller.updateTodo);

//delete todo
router.delete("/delete/:id", controller.deleteTodo);

module.exports = router;
