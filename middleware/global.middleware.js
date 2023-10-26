// const db = require('../users/user.db')

const UserModel = require('../models/user.model')

const jwt = require('jsonwebtoken')

const checkBody = (req, res, next) => {
    if (!req.body) {
        res.status(400).json({
            data:null,
            error: "must have a body"
        })
    }
    next()
}

const bearerTokenAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers

        if (!authHeader.authorization) {
            return res.status(401).json({
                message: 'You are not authenticated!'
            })
        }

        const token = authHeader.authorization.split(' ')[1] //bearer token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decoded)
        const user = await UserModel.findOne({ _id: decoded._id})

        if(!user){
            return res.status(401).json({
                message:'Unauthorized'
            })
        }

        req.user = user

        next()

    } catch (error) {
        // console.log(error)
        return res.status(401).json({
            message:'Unauthorized'
        })
    }
}

module.exports = {
    checkBody,
    bearerTokenAuth,
}