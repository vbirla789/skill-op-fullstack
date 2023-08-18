const User = require("../models/user");

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        const {
            email,
            firstname,
            lastname,
            skills,
            jobTitle,
            educationInstitution,
            startYear,
            endYear,
            whatsappNumber,
            upiId,
            linkedinId,
            about,
            pastExp,
            futurePlans,
        } = req.body;
        // need to verify if this email is valid or not
        if (email) user.email = email;
        // console.log("🚀", req.file);

        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        if (skills) user.skills = skills;
        if (jobTitle) user.jobTitle = jobTitle;
        if (educationInstitution) user.educationInstitution = educationInstitution;
        if (startYear) user.startYear = startYear;
        if (endYear) user.endYear = endYear;
        if (whatsappNumber) user.whatsappNumber = whatsappNumber;
        if (upiId) user.upiId = upiId;
        if (linkedinId) user.linkedinId = linkedinId;
        if (about) user.about = about;
        if (pastExp) user.pastExp = pastExp;
        if (futurePlans) user.futurePlans = futurePlans;
        if (startYear && !endYear) {
            return res.status(400).send({
                result: false,
                err: "End year is required",
                message: "End year is required",
            })
        }
        if (endYear && !startYear) {
            return res.status(400).send({
                result: false,
                err: "Start year is required",
                message: "Start year is required",
            })
        }
        if (startYear && endYear && startYear > endYear) {
            return res.status(400).send({
                result: false,
                err: "Start year cannot be greater than end year",
                message: "Start year cannot be greater than end year",
            })
        }
        if (req.file.fieldname == "profilePic") {
            user.profilePicUrl =
                process.env.BASE_URL + "/api/public/users/" + req.file.filename;
        }
        
        await user.save();
        res.status(200).send({
            result: user,
            message: "Profile updated successfully",
        })
    } catch (error) {
        res.status(500).send({
            err: error.message,
            message: "Internal server error"
        })
    }
}


exports.getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("posts").populate("mentor");

        res.status(200).send({
            result: user,
            message: "Profile fetched successfully",
        })
    } catch (error) {
        res.status(500).send({
            result: false,
            err: error.message,
        })
    }
}

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate("posts").populate("mentor");
        if (!user) {
            return res.status(404).send({
                result: false,
                err: "User not found",
                message: "User not found",
            })
        }
        res.status(200).send({
            result: user,
            message: "Profile fetched successfully",
        })
    } catch (error) {
        res.status(500).send({
            result: false,
            err: error.message,
            message: "Internal server error"
        })
    }
}

exports.getAllUsers = async (req, res) => {
    // console.log("👍")
    try {
        const users = await User.find({});
        res.status(200).send({
            result: user,
            message: "Profile fetched successfully",
        })
    } catch (error) {
        res.status(500).send({
            result: false,
            err: error.message,
            message: "Internal server error"
        })
    }
}

exports.searchUsers = async (req, res) => {
    try {
        // console.log(":)")

        const searchTerm = req.body.searchTerm;
        // const searchTerm = req.query.searchTerm;
        if (!searchTerm) {
            return res.status(400).send({
                result: false,
                err: "No search term provided",
                message: "No search term provided",
            })
        }
        // const users = await User.find({ $text: { $search: searchTerm } });
        const users = await User.find({
            $or: [
                { firstname: { $regex: searchTerm, $options: "i" } },
                { lastname: { $regex: searchTerm, $options: "i" } },
                { email: { $regex: searchTerm, $options: "i" } },
                { jobTitle: { $regex: searchTerm, $options: "i" } },
                { educationInstitution: { $regex: searchTerm, $options: "i" } },
                { skills: { $regex: searchTerm, $options: "i" } },
                { about: { $regex: searchTerm, $options: "i" } },
                { pastExp: { $regex: searchTerm, $options: "i" } },
                { futurePlans: { $regex: searchTerm, $options: "i" } },
            ]
        });
        res.status(200).send({
            result: users,
            message: "Users fetched successfully",
        })
    } catch (error) {
        res.status(500).send({
            result: false,
            err: error.message,
            message: "Internal server error"
        })
    }
}