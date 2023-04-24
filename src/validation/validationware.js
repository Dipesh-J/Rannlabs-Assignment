const validation = require("./validation");

module.exports = {
  loginValidation: (req, res, next) => {
    const { error } = validation.loginValidation.validate(req.body);
    if (error) {
      return res.status(400).send({ status: false, message: error.message });
    } else next();
  },
  teacherValidation: (req, res, next) => {
    const { error } = validation.teacherModel.validate(req.body);
    if (error) {
      return res.status(400).send({ status: false, message: error.message });
    } else next();
  },
  studentValidation: (req, res, next) => {
    const { error } = validation.StudentModel.validate(req.body);
    if (error) {
      return res.status(400).send({ status: false, message: error.message });
    } else next();
  },
};
