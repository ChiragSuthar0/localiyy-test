import Joi from "joi";

export const loginSchemaValidation = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
};

export const singupSchemaValidation = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    username: Joi.string().required(),
    location: Joi.object({
      type: "Point",
      coordinates: [Number],
      address: String,
      description: String,
    }),
    active: false,
    photo: Joi.string(),
  },
};
