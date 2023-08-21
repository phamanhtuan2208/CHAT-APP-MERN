const express = require('express');
const {
    registerUser,
    authUser,
    allUsers,
} = require('../Controllers/userControllers');
const { protect } = require('../Middleware/authMiddleware');

const router = express.Router();

router.route('/').post(registerUser).get(protect, allUsers);

router.route('/login').post(authUser);

module.exports = router;
