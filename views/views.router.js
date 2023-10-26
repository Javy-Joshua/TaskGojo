const express = require("express");
const cookieParser = require("cookie-parser");
const userService = require('../user/users.services')
const todoService = require('../todo/todo.controller')
const jwt = require("jsonwebtoken");

require("dotenv").config();

const router = express.Router();
router.use(cookieParser());

// router.get("/index", (req, res) => {
//   res.render("login", { user: res.locals.user || null });
// });

router.get("/signup", async (req, res) => {
  res.render("signUp");
});

router.get("/login", async (req, res) => {
  const response = await userService.Login({ email: req.body.email, password: req.body.password })

    if (response.code === 200) {
        // set cookie
        res.cookie('jwt', response.data.token)
        res.redirect('/api/dashboard')
    } else {
        res.render("login");
    }
    res.render("login");
});

// router.use(async (req, res, next) => {
//   const token = req.cookies.jwt;

//   if (token) {
//     try {
//       const decodedValue = await jwt.verify(token, process.env.JWT_SECRET);

//       res.locals.user = decodedValue;
//       next();
//     } catch (error) {
//       // Invalid or expired token
//       res.clearCookie("jwt"); // Clear the invalid token
//       res.redirect("login");
//     }
//   } else {
//     // No token present, but allow access to certain routes
//     const allowedRoutes = ["/signup", "/login"]; // Add more routes as needed

//     if (allowedRoutes.includes(req.originalUrl)) {
//       next(); // Allow access to these routes
//     } else {
//       // Redirect to login for all other routes
//       res.redirect("login");
//     }
//   }
// });


//Todos
router.get("/todos/all", async (req, res) => {
  const token = req.cookies.jwt;
  const response = await todoService.GetAllTodo();
    res.render("viewTasks", {
      todos: response.data.todo})
})

router.get("/dashboard", async (req, res) => {
  res.render("dashboard");
});

router.get("/todos/create", (req, res) => {
  res.render("createTask");
});

router.get("/todos/update/:id", async (req, res) => {
  const todoId = req.params.id;
  res.render("updateTask", { todoId });
});

//logout
router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("homepage");
});

module.exports = router;


// if (!token) {
//   res.redirect("login");
// } else {
//   const response = await todoService.GetAllTodo();
//   res.render("viewTasks", {
//     todos: response.data.todo,
//   });
// }