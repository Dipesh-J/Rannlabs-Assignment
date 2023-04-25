const jwt = require("jsonwebtoken")
const teacherModel = require("../models/teacherModel");

//================================================Authentication======================================================//

// Middleware for authentication, checks if token is valid and sets loginId in request object
const authentication = function (req, res, next) {
    try {
        const Bearer = req.headers["authorization"]  // token from headers
        if (!Bearer) {
            // if token is not present in headers
            return res.status(400).send({ status: false, message: "token must be present" })
        }
        else {
            const token = Bearer.split(" ")
            if (token[0] !== "Bearer") {
                // if token is not a Bearer token
                return res.status(400).send({ status: false, message: "Select Bearer Token in headers" })
            }
            jwt.verify(token[1], process.env.SECRET_KEY, function (err, decodedToken) {
                // verify the token using secret key

                if (err) {
                    // if error in token verification
                    if (err.message == "invalid token" || err.message == "invalid signature") {
                        return res.status(401).send({ status: false, message: "Token in not valid" })
                    }
                    if (err.message == "jwt expired") {
                        return res.status(401).send({ status: false, message: "Token has been expired" })
                    }
                    return res.status(401).send({ status: false, message: err.message })
                }
                else {
                    // if token is valid
                    req.loginId = decodedToken.Id;      // Setting the studentId in request object globally to access it in other API's
                    next();      // if authenticated, move to the next middleware
                }
            })
        }
    }
    catch (error) {
        return next(error); // handling any errors
    }
}


//===============================================Authorization====================================================//


const authorization = async function (req, res, next) {
    try {
        const teacherId = req.params.teacherId; // getting the teacherId from the request parameters

        let teacher = await teacherModel.findById(teacherId); // finding the teacher by their ID
        if (!teacher) { // if teacher is not found, return error response
            return res.status(404).send({ status: false, message: 'Teacher does not exist' });
        }

        req.teacherData = teacher; // attaching the teacher data to the request object

        let tokenTeacherId = req.loginId; // getting the teacherId from the token in the request header
        if (tokenTeacherId != teacherId) { // checking if the token teacherId matches the requested teacherId
            return res.status(403).send({ status: false, message: "You are not authorized to perform this task" });
        }

        next(); // if authorized, move to the next middleware
    }
    catch (error) {
        return next(error); // handling any errors
    }
}





module.exports = { authentication, authorization }