const joi = require("joi");

module.exports = {
  StudentModel: joi.object({
    firstName: joi
      .string()
      .trim()
      .required()
      .messages({ "any only": "First Name is mandatory field." })
      .regex(/^[a-z ,.'-]+$/i),
    lastName: joi
      .string()
      .trim()
      .required()
      .messages({ "any only": "Last Name is mandatory field." })
      .regex(/^[a-z ,.'-]+$/i),
    schoolName: joi
      .string()
      .trim()
      .required()
      .messages({ "any only": "School Name is mandatory field." })
      .regex(/^[a-z ,.'-]+$/i),
    email: joi.string().email().required(),
    mobile: joi
      .string()
      .pattern(/^\d{10}$/)
      .required(),
    password: joi
      .string()
      .min(8)
      .max(15)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/)
      .messages({ "string.pattern.base": "Password must contain atleast One lowercase character , one uppercase character, a number and a special symbol" })
      .required(),
    photo: joi.string().uri().allow(null),
  }),
  teacherModel: joi.object({
    email: joi.string().email().required(),
    mobile: joi
      .string()
      .pattern(/^\d{10}$/)
      .required(),
    password: joi
      .string()
      .min(8)
      .max(15)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/)
      .messages({ "string.pattern.base": "Password must contain atleast One lowercase character , one uppercase character, a number and a special symbol" })
      .required(),
  }),
  loginValidation: joi.object({
    mobile: joi
      .string()
      .pattern(/^\d{10}$/)
      .required(),
    password: joi
      .string()
      .min(8)
      .max(15)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/)
      .messages({ "string.pattern.base": "Password must contain atleast One lowercase character , one uppercase character, a number and a special symbol" })
      .required(),
  }),
};
