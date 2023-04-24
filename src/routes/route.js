const router = require('express').Router()
const adminController = require('../controllers/adminController')
const { uploadQuestion } = require('../controllers/questionsController')
const validationware = require('../middleware/validationware')

router.post('/register',validationware.adminValidation,adminController.adminRegister)
router.post('/login',validationware.adminValidation,adminController.adminLogin)
router.post('/uploadQuestion',uploadQuestion)

module.exports = router