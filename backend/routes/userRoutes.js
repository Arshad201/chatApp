const express = require('express');
const router = express.Router();
const { registerUser, authUser, allUsers } = require('../controllers/userController.js');
const protect = require('../middleware/authmiddleware.js');

router.route('/').post(registerUser).get(protect, allUsers);
router.post('/login', authUser)

module.exports = router;