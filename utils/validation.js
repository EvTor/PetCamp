import { campValidatonSchema } from "../expressValidationSchemas/campValidationSchema.js";
import { reviewValidationSchema } from "../expressValidationSchemas/reviewValidationSchema.js";
import { AppError } from "../utils/AppError.js";
//Middleware for Joi validation
export const validateCamp = (req, res, next) => {
  const { error } = campValidatonSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

export const validateReview = (req, res, next) => {
  const { error } = reviewValidationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};