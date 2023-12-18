import Joi from "joi";

export const loginSchemaValidation = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
};

export const signUpSchemaValidation = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    coordinates: Joi.array(),
  },
};

export const upgradeProfileSchemaValidation = {
  body: {
    username: Joi.string().required(),
    avatar: Joi.string().required(),
    email: Joi.string().required(),
  },
};

export const addDefaultLocation = {
  body: {
    email: Joi.string().email().required(),
    location: Joi.object({
      type: "Point",
      coordinates: [Number],
    }).required(),
  },
};
