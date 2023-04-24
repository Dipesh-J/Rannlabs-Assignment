const studentModel = require("../models/studentModel");
const jwt = require("jsonwebtoken");
const aws = require("../awsS3/aws");
const bcrypt = require("bcrypt");


//================================================================== REGISTER ===================================================================//

const studentRegister = async (req, res, next) => {
  try {
    const data = req.body;
    const { firstName, lastName, schoolName, email, mobile, password } = data;
    const photo = req.files;
    // check the uniqueness of the details
    const uniquenessCheck = await studentModel.findOne({ email: email });
    if (uniquenessCheck) {
      if (uniquenessCheck.email === email) {
        return res.status(400).send({
          status: false,
          message: "Student with this email already exists",
        });
      }
      if (uniquenessCheck.mobile === mobile) {
        return res.status(400).send({
          status: false,
          message: "Student with this mobile already exists",
        });
      }
    }
    // GENERATING THE AWS S3 LINK FOR THE PHOTO BEFORE SAVING IT IN THE DATABASE
    const uploadedPhotoUrl = await aws.uploadFile(photo[0]);
    data.photo = uploadedPhotoUrl;
    // REGISTERING STUDENTS
    const registeredStudent = await studentModel.create(data);
    return res.status(201).send({
      status: true,
      data: registeredStudent,
      message: "Registered Successfully",
    });
  } catch (error) {
    return next(error);
  }
};


//================================================================== LOGIN ===================================================================//

const studentLogin = async (req, res, next) => {
  try {
    const credentials = req.body;
    const { mobile, password } = credentials;
  
    if (Object.keys(credentials).length === 0) {
      return res.status(400).send({
        status: false,
        message: "Mobile No. and password are required to login",
      });
    }
    if (!mobile) {
      return res
        .status(400)
        .send({ status: false, message: "Mobile No. is mandatory" });
    }
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "password is mandatory" });
    }
    const studentDetail = await studentModel.findOne({ mobile: mobile });
    if (!studentDetail) {
      return res
        .status(404)
        .send({
          status: false,
          message: "Student not found with this Mobile No.",
        });
    }
    const hashedPassword = studentDetail.password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
  
    if (!passwordMatch) {
      return res
        .status(400)
        .send({ status: false, message: "Incorrect Password" });
    }
  
    const token = jwt.sign(
      {
        Id: studentDetail._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1m" }
    );
    // Now we can store the token inside the cookies or local storage to access them inside the browser in the frontend
    res.cookie("jwt", token, { httpOnly: true, maxAge: 60000 }); // Here 60000 ms is equal to 1 minute
  
    return res.status(200).send({ status: true, message: "Student Logged In successfully", data: {studentId: studentDetail._id, token: token}})
  } catch (error) {
    return next(error);
  }
};

module.exports = { studentRegister, studentLogin };