const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
    // Auto Created each time a user is created
    __created: {
        type: Date,
        default: Date.now,
    },

    // Required Info
    firstname: {
        type: String,
        required: [true, "first name is required"],
    },
    lastname: {
        type: String,
        required: [true, "last name is required"],
    },
    email: {
        type: String,
        default: false,
        required: [true, "Email is required"],
        unique: [true, "Email already exist"],
        validate: {
            validator: function (v) {
                return /\S+@\S+\.\S+/.test(v); // Basic email format validation
            },
            message: (email) => `${email.value} is not a valid email address!`,
        },
    },
    password: {
        type: String,
        required: true,
        select: false,
        minLength: [6, "Password must be atleast 6 character"],
    },

    // Stores all the created posts
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "posts",
        },
    ],

    connects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
    ],

    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
    ],

    followings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
    ],

    postViewed: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "posts",
        },
    ],

    postLiked: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "posts",
        },
    ],

    // postImpressed: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "posts",
    //     },
    // ],

    profilePicUrl: { type: String },
    bgPicUrl: { type: String },

    isMentor: { type: Boolean, default: false, required: true },

    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "mentors",
        required: function () {
            return this.isMentor;
        },
        default: null,
    },

    skills: [
        {
            type: String,
        },
    ],

    jobTitle: { type: String, default: "student" },

    educationInstitution: { type: String },
    startYear: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: "{VALUE} is not an integer value",
        },
    },
    endYear: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: "{VALUE} is not an integer value",
        },
    },

    // validate a phone number
    whatsappNumber: {
        type: String,
        // validate: {
        //     validator: function (v) { return /\d{10}/.test(v); },
        //     message: '{VALUE} is not a valid phone number!'
        // },
        default: "",
    },
    // validate upiId
    upiId: {
        type: String,
        default: "",
    },

    // validate linkedinId
    linkedinId: {
        type: String,
        default: "",
    },
    about: { type: String, default: "" },
    pastExp: { type: String, default: "" },
    futurePlans: { type: String, default: "" },
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "notifications",
        },
    ],
    // for resetting password
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    meetScheduled: {
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
});

// Reset password token generation
UserSchema.methods.generatePasswordReset = function () {
    const token = crypto.randomBytes(20).toString("hex");
    // console.log(token);
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    // console.log(
    //     Date.now() + process.env.PASSWORD_RESET_LINK_EXPIRY * 60 * 1000
    // );
    this.resetPasswordExpires =
        Date.now() + process.env.PASSWORD_RESET_LINK_EXPIRY * 60 * 1000;
    return token;
};

// Password Hashing
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Password Compare
UserSchema.methods.comparePassword = async function (password) {
    // console.log(password, this.password);
    return await bcrypt.compare(password, this.password);
};

// Generate Token
UserSchema.methods.generateToken = async function () {
    return await jwt.sign({ _id: this._id }, process.env.JWT_KEY, {
        expiresIn: "7d",
    });
};

module.exports = mongoose.model("users", UserSchema);
