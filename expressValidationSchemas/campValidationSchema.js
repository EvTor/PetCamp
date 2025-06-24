import Joi from "joi";
export const campValidatonSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().min(3),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});