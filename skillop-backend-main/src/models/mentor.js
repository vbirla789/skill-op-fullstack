const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
    __created: {
        type: Date,
        default: Date.now(),
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },

    actualAvailability: {
        type: {
            monday: [{ s: Number, e: Number }],
            tuesday: [{ s: Number, e: Number }],
            wednesday: [{ s: Number, e: Number }],
            thusday: [{ s: Number, e: Number }],
            friday: [{ s: Number, e: Number }],
            saturday: [{ s: Number, e: Number }],
            sunday: [{ s: Number, e: Number }],
        },
    },

    meetRequests: {
        type: {
            monday: [{ type: mongoose.Schema.Types.ObjectId, ref: "meet" }],
            tuesday: [{ type: mongoose.Schema.Types.ObjectId, ref: "meet" }],
            wednesday: [{ type: mongoose.Schema.Types.ObjectId, ref: "meet" }],
            thusday: [{ type: mongoose.Schema.Types.ObjectId, ref: "meet" }],
            friday: [{ type: mongoose.Schema.Types.ObjectId, ref: "meet" }],
            saturday: [{ type: mongoose.Schema.Types.ObjectId, ref: "meet" }],
            sunday: [{ type: mongoose.Schema.Types.ObjectId, ref: "meet" }],
        },
    },

    currentAvailability: {
        type: {
            monday: [{ s: Number, e: Number }],
            tuesday: [{ s: Number, e: Number }],
            wednesday: [{ s: Number, e: Number }],
            thusday: [{ s: Number, e: Number }],
            friday: [{ s: Number, e: Number }],
            saturday: [{ s: Number, e: Number }],
            sunday: [{ s: Number, e: Number }],
        },
    },

    chargePerHour: { type: Number, default: 300 },
});



module.exports = mongoose.model("mentors", MentorSchema);
