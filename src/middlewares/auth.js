const jwt = require("jsonwebtoken")
const teacherModel = require("../models/teacherModel");

//================================================Authentication======================================================//

const authentication = function (req, res, next) {
    try {
        const Bearer = req.headers["authorization"]  // token from headers
        if (!Bearer) {
            return res.status(400).send({ status: false, message: "token must be present" })
        }
        else {
            const token = Bearer.split(" ")
            if (token[0] !== "Bearer") {
                return res.status(400).send({ status: false, message: "Select Bearer Token in headers" })
            }
            jwt.verify(token[1], process.env.SECRET_KEY, function (err, decodedToken) {

                if (err) {
                    if (err.message == "invalid token" || err.message == "invalid signature") {
                        return res.status(401).send({ status: false, message: "Token in not valid" })
                    }
                    if (err.message == "jwt expired") {
                        return res.status(401).send({ status: false, message: "Token has been expired" })
                    }
                    return res.status(401).send({ status: false, message: err.message })
                }
                else {
                    req.loginId = decodedToken.Id;      // Setting the studentId in request object globally to access it in other API's
                    next();
                }
            })
        }
    }
    catch (error) {
        return next(error);
    }
}

//===============================================Authorization====================================================//


const authorization = async function (req, res, next) {
    try {
        const teacherId = req.params.teacherId;

        let teacher = await teacherModel.findById(teacherId);
        if (!teacher) {
            return res.status(404).send({ status: false, message: 'Teacher does not exist' });
        }
        req.teacherData = teacher;
        let tokenTeacherId = req.loginId; // loginId from request header
        if (tokenTeacherId != teacherId) {
            return res.status(403).send({ status: false, message: "You are not authorized to perform this task" });
        }
        next();
    }
    catch (error) {
        return next(error);
    }
}




module.exports = { authentication, authorization }