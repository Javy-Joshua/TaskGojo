const TodoModel = require('../models/Todo.model')
const logger = require("../logger");

const CreateTodo = async (req, res) => {
    try {
        const todoFromRequest = req.body

        const todo = await TodoModel.create({
          title: todoFromRequest.title,
          description: todoFromRequest.description,
          // status: todoFromRequest.status,
          // user_id: user.id
        });
        //     // console.log(todo)
        // return res.status(201).redirect(`/todos/${todo.id}`);
        res.redirect("/api/todos/all")
        // json({       
        //     message: 'Todo created successfully',  //render('createTask',{ })
        //     todo
        // })

    } catch (error) {
        return res.status(500).json({
          message: "Server Error",
          data: null,
        });
    }
}


const GetAllTodo = async (req, res) => {
    try {
        const query = req.query

        const todoArray = await TodoModel.find();
        
        let todoArrayDuplicate = todoArray;

        if (query.description) {
            todoArrayDuplicate = todoArrayDuplicate.filter(td => td.description.includes(query.description))
        }

        if (query.limit) {
            todoArrayDuplicate = todoArrayDuplicate.slice(0, query.limit - 1)
        }

        if (query.search) {
            todoArrayDuplicate = todoArrayDuplicate.filter(td => td.status.includes(query.search) || td.description.includes(query.search))
        }

        res.status(200).render("viewTasks", {
          status: true,
          message: "Tasks fetched successfully",
          data: todoArray,
        });
        // json({
        //     data: todoArrayDuplicate,
        //     error: null
        // })
        
    } catch (error) {
      logger.error(`Error fetching tasks: ${error.message}`);
        console.error(error)
         return res.status(500).json({
           message: "Server Error",
           data: null,
           InternalServerErr:"get all"
         });
    }
}

const GetTodo = async(req, res) => {
    try {
        const todoId = req.params.id;
        const foundTodo = await TodoModel.findOne({ _id: todoId });

        if (!foundTodo) {
          return res.status(404).render('404', {
            message:'Task not found',
            success: false
          });
          // json({
          //     message:'Todo not found',
          //     success: false
          // })
        }
        
        if (foundTodo.status === "deleted") {
          return res.status(204).json({
            message: "No content",
            status: true,
          });
        }

        return res.status(200).render('viewSingle', {
          todoId, foundTodo
        })
        // json({
        //   foundTodo,
        // });

    } catch (error) {
      logger.error(`Error fetching tasks: ${error.message}`);
        return res.status(500).json({
          message: "Server Error",
          data: null,
        });
    }
}

const updateTodo = async (req, res) => {
    
    try {
        const todoId = req.params.id;
        const update = req.body
        const todo = await TodoModel.findOne({_id: todoId})
        if (!todo){
            return res.status(404).json({
                message:"Todo not found"
            })
        }

        if (todo.status === "deleted") {
           return res.status(204).json({
            message: "No content",
            status: true,
           });
        }

        // const todoUpdate = await TodoModel.findByIdAndUpdate({ todoId },{ ...update }, { new: true } )
        const todoUpdate = await TodoModel.findByIdAndUpdate(todoId, update, { new: true } )
        console.log("todoUpdate", todoUpdate);

        if (!todoUpdate) {
            return res.status(404).render("404", {
              message: "Task not found",
              success: false,
            });
            // json({
            //   message: "Todo not found for update",
            // });

        }

        return res.status(200).redirect(`/todos/${todoUpdate.id}`);
        // json({
        //     todoUpdate
        // })

    } catch (error) {
      logger.error(`Error fetching tasks: ${error.message}`);
        return res.status(500).json({
          message: "Server Error",
          data: null,
        });
    }
}

const deleteTodo = async (req, res) => {
    try {
      const todoId = req.params.id;

      const todo = await TodoModel.findOne({ _id: todoId });
      if (!todo) {
        return res.status(404).render("404", {
          message: "Task not found",
          success: false,
        });
        // json({
        //   message: "Todo not found",
        // });
      }

      if (todo.status === "deleted") {
        return res.status(204).json({
          message: "No content",
          status: true,
        });
      }

    //   await TodoModel.findByIdAndDelete(todoId, { status: "deleted" });

      // Update the status of the todo to 'deleted' and then delete it
      const deletedTodo = await TodoModel.findByIdAndUpdate(
        todoId,
        { status: "deleted" },
        { new: true }
      );

      if (!deletedTodo) {
        return res.status(404).render("404", {
          message: "Task not found",
          success: false,
        });
        // json({
        //   message: "Todo not found for deletion",
        // });
      }

      return res.status(200).send({
        status: true,
        message: "Todo deleted successfully",
      });
    } catch (error) {
      logger.error(`Error fetching tasks: ${error.message}`);
       return res.status(500).json({
         message: "Server Error",
         data: null,
       }); 
    }
}




module.exports = {
    CreateTodo,
    GetAllTodo,
    GetTodo,
    updateTodo,
    deleteTodo
}