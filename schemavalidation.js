const joi = require("joi");

//register validation
const registerValidation = (payload) => {
  const schema = joi.object({
    profileImage: joi.string(),
    firstname: joi.string().min(3).required(),
    lastname: joi.string().min(3).required(),
    email: joi.string().min(6).email().required(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(payload);
};

module.exports.registerValidation = registerValidation;
