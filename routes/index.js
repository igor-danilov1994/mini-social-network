const express = require('express')
const multer = require('multer')
const { UserController } = require("../controllers");
const checkToken = require("../middlewares/auth");
const router = express.Router();

const uploadDestination = 'uploads'

//Show where set files
const storage = multer.diskStorage({
    destination: uploadDestination,
    filename: function (req, file, next){
        next(null, file.originalname)
    }
})

const uploads = multer({storage})
const {register, login, current, getUserById, updateUser} = UserController

router.post('/register', register)
router.post('/login', login)
router.get('/current', checkToken, current)
router.get('/user/:id', checkToken, getUserById)
router.put('/users/:id', checkToken, updateUser)

module.exports = router