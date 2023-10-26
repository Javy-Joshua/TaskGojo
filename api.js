const express = require("express");
const cors = require('cors')
const UserModel = require('./models/user.model')
const TodoModel = require('./models/Todo.model')
const userRouter = require('./user/users.router')
const todoRouter = require('./todo/todo.router')
const viewRouter = require('./views/views.router')
const morgan = require('morgan')
const bodyParser = require('body-parser')


const app = express()
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(morgan("dev"));


app.use(express.json()) //body parser
app.use(express.urlencoded({ extended: true })); // body parser: formdata
app.use(cors())

app.get('/users', async (req, res) => {
    const users =  await UserModel.find({ email: "hot@plate.com"}).limit(2).select({ name: 1, contact: 1, })
    return res.json({
        users
    })
})

app.get("/", (req, res) => {
  res.render("homepage");
});


app.use('/users', userRouter )
app.use('/api', viewRouter)

app.use('/todos', todoRouter)

app.get('*', (req, res) => {
    return res.render("404", {
      error: "Route not found",
    });
    // status(404).json({
    //     data:null,
    //     error: "Route not found"
    // })
})


// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.render("404", {
    error: "Route not found",
  });
  // status(500).json({
  //     data: null,
  //     error: "Route not found"
  // })
})

module.exports = app