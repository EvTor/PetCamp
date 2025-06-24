import Joi from "joi";
export const reviewValidationSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).required(),
        body: Joi.string().required()
    }).required()
})