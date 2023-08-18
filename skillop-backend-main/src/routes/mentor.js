const express = require('express');
const { isAuthorised } = require('../middleware/auth');
const { becomeAMentor, requestAppointment, getAvailability } = require('../controllers/mentor');
const router = express.Router();

router.route("/mentor/become").put(isAuthorised, becomeAMentor);
router.route("/mentor/book/:mentorId").post(isAuthorised, requestAppointment);
router.route("/mentor/availability/:mentorId").get(isAuthorised, getAvailability);
module.exports = router;