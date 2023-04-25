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
    // Input data will come inside request body
    const data = req.body;
    // Now destructuring our data
    const { email, mobile, password } = data;

       // Check the uniqueness of the details
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
    // Taking credentials as input
    const credentials = req.body;
    const { mobile, password } = credentials;
    // Checking if both the fields are present 
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
    // Finding the teacher in the database to check if he/she exists or not
    const teacherDetail = await teacherModel.findOne({ mobile: mobile });
    if (!teacherDetail) {
      return res.status(404).send({
        status: false,
        message: "Teacher not found with this mobile.",
      });
    }
    // Comparing the passwords using .compare method as password is hashed before getting stored in the Database
    const hashedPassword = teacherDetail.password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      return res
        .status(400)
        .send({ status: false, message: "Incorrect Password" });
    }
    // Signing JWT using ObjectId of teacher 
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
    let { studentId } = req.body; // Get studentId from request body
    const assignmentFile = req.files; // Get assignment file from request files
    studentId = JSON.parse(studentId); // Parse studentId from string to JSON

    const assignment = await aws.uploadFile(assignmentFile[0]); // Upload assignment file to AWS S3 and get the file URL

    // Loop through the studentId array and assign the assignment to each student
    for (let i = 0; i < studentId.length; i++) {
      if (ObjectId.isValid(studentId[i])) { // Check if the studentId is a valid ObjectId
        const allotedStudents = await studentModel.findOneAndUpdate(
          { _id: studentId[i] }, // Find the student with the given Id
          { $push: { assignments: assignment } }, // Push the assignment URL to the student's assignments array
          { new: true } // Return the updated student object
        );
        console.log(allotedStudents);
      }
    }
    return res.status(200).send({ status: true, message: "Assignment Given" }); // Return a success response
  } catch (error) {
    return next(error); // Handle any errors and pass to the error handling middleware
  }
};


module.exports = { teacherRegister, teacherLogin, uploadAssignment };
