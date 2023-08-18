const mongoose = require("mongoose");
const MEET_STATUS = require("../enums/meetStatus");

const MeetSchema = new mongoose.Schema({
    __created: {
        type: Date,
        default: Date.now,
    },
    day: {
        type: String,
        enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ],
        required: true,
    },
    s: {
        type: Number,
        required: true,
    },
    e: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(MEET_STATUS),
        default: MEET_STATUS.ACCEPTED,
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    mentee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
});

module.exports = mongoose.model("meet", MeetSchema);
