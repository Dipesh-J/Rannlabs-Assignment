const studentModel = require("../models/studentModel");
const jwt = require("jsonwebtoken");
const aws = require("../awsS3/aws");
const bcrypt = require("bcrypt");


//================================================================== REGISTER ===================================================================//

const studentRegister = async (req, res, next) => {
  try {
    // Input data will come inside request body
    const data = req.body;
    // Now destructuring our data
    const { firstName, lastName, schoolName, email, mobile, password } = data; 
    const photo = req.files;
    // Check the uniqueness of the details
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
    // Generating the aws s3 link for the photo before saving it in the database
    const uploadedPhotoUrl = await aws.uploadFile(photo[0]);
    data.photo = uploadedPhotoUrl;
    // Registering Students
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
    // Taking credentials as input
    const credentials = req.body;
    const { mobile, password } = credentials;
    // Checking if both the fields are present 
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
    // Finding the student in the database to check if he/she exists or not
    const studentDetail = await studentModel.findOne({ mobile: mobile });
    if (!studentDetail) {
      return res
        .status(404)
        .send({
          status: false,
          message: "Student not found with this Mobile No.",
        });
    }
    // Comparing the passwords using .compare method as password is hashed before getting stored in the Database
    const hashedPassword = studentDetail.password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
  
    if (!passwordMatch) {
      return res
        .status(400)
        .send({ status: false, message: "Incorrect Password" });
    }
  // Signing JWT using ObjectId of student 
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