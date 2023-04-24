const studentModel = require("../models/studentModel");
const aws = require("../awsS3/aws");
const teacherModel = require("../models/teacherModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
//================================================================== REGISTER ===================================================================//

const teacherRegister = async (req, res, next) => {
  try {
    const data = req.body;
    const { email, mobile, password } = data;

    // check the uniqueness of the email and mobile number
    const uniquenessCheck = await teacherModel.findOne({
      $or: [{ email: email }, { mobile: mobile }],
    });
    if (uniquenessCheck) {
      if (uniquenessCheck.email === email) {
        return res.status(400).send({
          status: false,
          message: "Teacher with this email already exists",
        });
      }
      if (uniquenessCheck.mobile === mobile) {
        return res.status(400).send({
          status: false,
          message: "Teacher with this mobile already exists",
        });
      }
    }

    // REGISTERING TEACHERS
    const registeredTeacher = await teacherModel.create(data);

    return res.status(201).send({
      status: true,
      data: registeredTeacher,
      message: "Registered Successfully",
    });
  } catch (error) {
    return next(error);
  }
};

//================================================================== LOGIN ===================================================================//

const teacherLogin = async (req, res, next) => {
  try {
    const credentials = req.body;
    const { mobile, password } = credentials;

    if (Object.keys(credentials).length === 0) {
      return res.status(400).send({
        status: false,
        message: "Mobile and password are required to login",
      });
    }
    if (!mobile) {
      return res
        .status(400)
        .send({ status: false, message: "Mobile is mandatory" });
    }
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "password is mandatory" });
    }
    const teacherDetail = await teacherModel.findOne({ mobile: mobile });
    if (!teacherDetail) {
      return res.status(404).send({
        status: false,
        message: "Teacher not found with this mobile.",
      });
    }
    const hashedPassword = teacherDetail.password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      return res
        .status(400)
        .send({ status: false, message: "Incorrect Password" });
    }

    const token = jwt.sign(
      {
        Id: teacherDetail._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    // Now we can store the token inside the cookies or local storage to access them inside the browser in the frontend
    res.cookie("jwt", token, { httpOnly: true, maxAge: 60000 }); // Here 60000 ms is equal to 1 minute

    return res.status(200).send({
      status: true,
      message: "Teacher Logged In successfully",
      data: { teacherId: teacherDetail._id, token: token },
    });
  } catch (error) {
    return next(error);
  }
};

//==================================================================UPLOAD ASSIGNMENT=======================================================//
const uploadAssignment = async (req, res, next) => {
  try {
    let { studentId } = req.body;
    const assignmentFile = req.files;
    studentId = JSON.parse(studentId);

    const assignment = await aws.uploadFile(assignmentFile[0]);

    console.log(assignment, typeof studentId);

    for (let i = 0; i < studentId.length; i++) {
      if (ObjectId.isValid(studentId[i])) {
        const allotedStudents = await studentModel.findOneAndUpdate(
          { _id: studentId[i] },
          { $push: { assignments: assignment } },
          { new: true }
        );
        console.log(allotedStudents);
      }
    }
    return res.status(200).send({ status: true, message: "Assignment Given" });
  } catch (error) {
    return next(error);
  }
};

module.exports = { teacherRegister, teacherLogin, uploadAssignment };
