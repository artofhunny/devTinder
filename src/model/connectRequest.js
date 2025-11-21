const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: "User",
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: "User",
        },
        status: {
            type: String,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: `{VALUE} is incorrect status type`,
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("connectionRequest", connectionRequestSchema);