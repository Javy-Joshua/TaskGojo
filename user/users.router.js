const express = require("express");
const middleware = require("./users.middleware");
const controller = require("./users.controller");
// const { response } = require("../api");

const router = express.Router();



//create user
router.post("/signup", middleware.ValidateUserCreation, controller.CreateUser);


// log in user
router.post("/login", middleware.LoginValidation, controller.Login);

router.get("/happy", async (req, res) => {
  return res.json({
    data: "STAY HAPPY!!",
  });
});

module.exports = router;




// router.get("/", async (req, res) => {
//   res.render("homepage");
// });