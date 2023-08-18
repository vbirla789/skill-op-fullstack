const User = require("../models/user");
exports.getNotification = async (req, res) => {
    try {
        // TODO display less notification
        const user = await User.findById(req.user._id).populate("notifications");
        res.status(200).send({
            result: user.notifications,
            message: "success"
        }
        )
    } catch (error) {
        res.status(500).send({
            result: false,
            err: error.message,
            message: "internal server error"
        })
    }
}