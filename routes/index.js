const express  = require ('express');
const RegisterUser = require('../controller/RegisterUser');
const checkEmail = require('../controller/checkEmail');
const checkPass = require('../controller/checkPass');
const userDetails = require('../controller/userDetail');
const Logout = require('../controller/Logout');
const updateUserDetail = require('../controller/updateUserDetail');
const SearchUser = require('../controller/searchUser');

const router = express.Router();


//Register API
router.post('/register', RegisterUser);

//check user email
router.post('/email',checkEmail);

//check password 
router.post('/password',checkPass);

//login userDetails
router.get('/user-details', userDetails);

//logout user
router.get('/logout', Logout);

//update user details
router.post('/update-user',updateUserDetail)

//search user
router.post('/search-user', SearchUser);

module.exports = router;