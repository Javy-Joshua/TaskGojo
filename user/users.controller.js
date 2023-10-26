const UserModel = require("../models/user.model");
const logger = require("../logger");
const jwt = require('jsonwebtoken')


require('dotenv').config()
 
const CreateUser = async (req, res) => {
    try {
        const userFromRequest = req.body;

        const existingUser =  await UserModel.findOne({
            email: userFromRequest.email
        })
        
        if(existingUser) {
            return res.render("signup", {
              message: "User already exist", ...req.body
            });
            // json({
            //     message: 'User already exist'
            // })
        }

        const user = await UserModel.create({
            name:userFromRequest.name,
            password: userFromRequest.password,
            email: userFromRequest.email,
            contact: userFromRequest.contact,
        })

        return res.redirect("/api/login");
        
        // json({
        //     message: 'User created successfully',
        //     user,
        //     token
        // })

    } catch (error) {
        logger.error(`Error fetching tasks: ${error.message}`);
        return res.render("signup", {
          message: "Server Error",
          ...req.body,
        });
        // status(500).json({
        //     message: 'Server Error',
        //     data: null
        // })
    }
}


const Login = async (req, res) => {
    try {

        const userFromRequest = req.body
        
        const user = await UserModel.findOne({
          email: userFromRequest.email,
        });

        if (!user) {
            return res.render("login", {
            //   message: 
              error:"User not found", ...req.body,
            });
            // status(404).json({
            //     message: 'User not found',
            // })
        }
        
        const validPassword = await user.isValidPassword(userFromRequest.password)
        // console.log(validPassword)

        if (!validPassword) {
            return res.render("login", {
              error: "Email or Password is not correct", ...req.body
            });
            // status(422).json({
            //     message: "Email or Password is not correct"
            // })
        }

        const token = await jwt.sign({ email: user.email, _id: user._id}, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.cookie("token", token, { httpOnly: true });

        return res.redirect("/api/dashboard")
       
        // });
        // json({
        //     message: 'Login successful',
        //     user,
        //     token
        // })

    } catch (error) {
        logger.error(`Error fetching tasks: ${error.message}`);
        console.error("Error in login:", error);
        return res.render("login", {
          message: "Server Error",
          ...req.body,
        });
        // status(500).json({
        //     message: 'Server Error',
        //     data: null
        // })
    }
}

const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(440).render("login");
  } catch (error) {
    logger.error(`Error fetching tasks: ${error.message}`);
    return res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
};



module.exports = { 
    CreateUser,
    Login,
    logOut,
}