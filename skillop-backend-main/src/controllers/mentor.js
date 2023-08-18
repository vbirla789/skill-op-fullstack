const User = require("../models/user");
const Mentor = require("../models/mentor");
const 
    isValidAvailability
 = require("../algo/availability/isValidAvailability");
const isValidOrder  = require("../algo/availability/isValidOrder");
const  getAvailability = require("../algo/availability/getAvailability");
const Meet = require("../models/meet");

exports.becomeAMentor = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user.isMentor) {
            return res.status(400).send({
                result: false,
                message: "You are already a mentor",
            });
        }
        if (!req.body.actualAvailability) {
            return res.status(400).send({
                result: false,
                message: "Please provide your availability",
            });
        }

        // check is availability is valid
        const availability = req.body.actualAvailability;
        let flag = true;
        const days = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ];
        for (let i = 0; i < days.length; i++) {
            if (!availability[days[i]]) {
                continue;
            }
            availability[days[i]] = isValidAvailability(availability[days[i]]);
            if (!availability[days[i]]) {
                flag = false;
                break;
            }
        }
        if (!flag) {
            return res.status(400).send({
                result: false,
                message: "Please provide valid availability",
            });
        }

        user.isMentor = true;

        // create new Mentor
        const mentor = new Mentor();
        mentor.user = user._id;
        mentor.actualAvailability = mentor.currentAvailability =
            req.body.actualAvailability;
        mentor.chargePerHour = req.body.chargePerHour | 300;

        const meetRequests = {};
        for (let i = 0; i < days.length; i++) {
            meetRequests[days[i]] = [];
        }

        mentor.meetRequests = meetRequests;

        await mentor.save();
        user.mentor = mentor._id;
        await user.save();

        res.status(200).send({
            result: true,
            message: "You are now a mentor",
        });
    } catch (error) {
        res.status(500).send({
            result: false,
            err: error.message,
            message: "Internal Server Error",
        });
    }
};

exports.requestAppointment = async (req, res) => {
    try {
        let { s, e, day } = req.body;
        const mentorId = req.params.mentorId;
        if (!s || !e || !mentorId || !day) {
            return res.status(400).send({
                result: false,
                message: "Please provide all the required fields",
            });
        }

        // check day is valid or not and convert it to lower case
        const days = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ];
        if (!days.includes(day.toLowerCase())) {
            return res.status(400).send({
                result: false,
                message: "Please provide valid day",
            });
        }
        day = day.toLowerCase();
        
        const mentor = await Mentor.findById(mentorId);
        const user = await User.findById(req.user._id);
        if (!mentor) {
            return res.status(400).send({
                result: false,
                message: "Mentor not found",
            });
        }

        // check if mentor is available or not
        if (!isValidOrder({ s, e }, mentor.currentAvailability[day])) {
            return res.status(400).send({
                result: false,
                message: "Mentor is not available at this time",
            });
        }

        const mentorUser = await User.findById(mentor.user);

        const meet = new Meet({
            mentor: mentorUser._id,
            mentee: user._id,
            s,
            e,
            day,
        });

        if (!user.meetScheduled) {
            user.meetScheduled = {};
        }
        
        if (!user.meetScheduled[day]) {
            user.meetScheduled[day] = [];
        }
        user.meetScheduled[day].push(meet._id);
        console.log(mentor.meetRequests[day])
        // place the order at the right place in meet request array so that the array remain sorted
        let meetRequests = [];
        if (mentor.meetRequests[day].length) {
            
            meetRequests = mentor.meetRequests[day].foreach(async (meetId, i) => {
                return await Meet.findById(meetId);
            });
        }

        let i = 0;
        for (; i < meetRequests.length; i++) {
            if (meetRequests[i].s > s) {
                break;
            }
        }

        mentor.meetRequests[day].splice(i, 0, meet._id);
        meetRequests.splice(i, 0, meet);
        // console.log(meetRequests);
        // mentor.meetRequests[day].push(meet._id);

        // get mentor new availability
        mentor.currentAvailability[day] = getAvailability(
            meetRequests,
            mentor.currentAvailability[day]
        );
        // console.log(mentor.currentAvailability)

        await meet.save();
        await mentor.save();
        await user.save();

        res.status(200).send({
            result: true,
            message: "Appointment requested",
        });
    } catch (error) {
        res.status(500).send({
            result: false,
            err: error.message,
            message: "Internal Server Error",
        });
    }
};

exports.getAvailability = async (req, res) => {
    try {
        
        const mentorId = req.params.mentorId;
        if (!mentorId) {
            return res.status(400).send({
                result: false,
                message: "mentorId is required",
            });
        }

        const mentor = await Mentor.findById(mentorId);
        if (!mentor) {
            return res.status(400).send({
                result: false,
                message: "Mentor not found",
            });
        }

        res.status(200).send({
            result: mentor.currentAvailability,
            message: "Availability fetched",
        });
    } catch (error) {
        res.send({
            result: false,
            err: error.message,
            message: "Internal Server Error",
        });
    }
}

