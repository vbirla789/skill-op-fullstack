const express = require('express');
const router = express.Router();

const { isAuthorised } = require('../middleware/auth');
const { getNotification } = require('../controllers/userNotification');

router.route("/user/notifications").get(isAuthorised, getNotification);

module.exports = router;