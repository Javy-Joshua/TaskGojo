const joi = require('joi')

const validateTodoCreation = async (req, res, next) => {
    try {
        const schema = joi.object({
            title:joi.string().min(4).max(50).required(),
            description:joi.string().min(4).max(1000).required()
        })

        await schema.validateAsync(req.body, {abortEarly: true})

        next()
    } catch (error) {
        return res.status(422).json({
            message: error.message,
            success: false
        })
    }
}

const validateUpdateTodo = async (req, res, next) => {
    try {
        const schema = joi.object({
          title: joi.string().min(4).max(50).required(),
          description: joi.string().min(4).max(1000).required(),
          status: joi.string().valid("pending", "completed").optional(),
        });

        await schema.validateAsync(req.body, { abortEarly: true })

        next()
    } catch (error) {
         return res.status(422).json({
           message: error.message,
           success: false,
         });
    }
}

module.exports = {
    validateTodoCreation,
    validateUpdateTodo
}