const router = require("express").Router();
const {studentRegister, studentLogin,} = require("../controllers/studentController");
const {teacherRegister, teacherLogin, uploadAssignment,} = require("../controllers/teacherController");
const { authentication, authorization } = require("../middlewares/auth");
const {loginValidation, teacherValidation, studentValidation} = require("../validation/validationware")
//====================================================Student API's=================================================================//
router.post("/registerStudent",studentValidation, studentRegister);
router.post("/loginStudent",loginValidation , studentLogin);

//====================================================Teacher API's=================================================================//
router.post("/registerTeacher",teacherValidation, teacherRegister);
router.post("/loginTeacher",loginValidation, teacherLogin);
router.post("/uploadAssignment/:teacherId",authentication, authorization, uploadAssignment);

//==================================================================================================================================//
router.all("/*", async function (req, res) {
    return res.status(400).send({ status: false, message: "Path is not valid" });
  });

module.exports = router;
