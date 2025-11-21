const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../model/connectRequest");
const User = require("../model/user");

const router = express.Router();

router.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedinUser._id,
      status: "interested",
    }).populate(
      "fromUserId",
      "firstName lastName age gender skills about photoUrl"
    );

    if (!connectionRequests) {
      return res
        .status(400)
        .json({ message: "you don't have any connection requests" });
    }

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(200).json({
      message: "Error while featching connection requests",
      error: err.message,
    });
  }
});

router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedinUser._id, status: "accepted" },
        { toUserId: loggedinUser._id, status: "accepted" },
      ],
    })
      .populate(
        "fromUserId",
        "firstName lastName age gender skills about photoUrl"
      )
      .populate(
        "toUserId",
        "firstName lastName age gender skills about photoUrl"
      );

    const mappedConnections = connections.map((connection) =>
      connection.fromUserId._id.equals(loggedinUser._id)
        ? connection.toUserId
        : connection.fromUserId
    );

    return res.json({
      message: "Connections fetched successfully",
      data: mappedConnections,
    });
  } catch (err) {
    res.status(200).json({
      message: "Error while featching connection",
      error: err.message,
    });
  }
});

router.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedinUser._id }, { toUserId: loggedinUser._id }],
    }).select("fromUserId toUserId");

    const ignoredUsers = new Set();

    connectionRequests.forEach((req) => {
      ignoredUsers.add(req.fromUserId.toString());
      ignoredUsers.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(ignoredUsers) } },
        { id: { $ne: loggedinUser._id } },
      ],
    })
      .select("firstName lastName age gender skills about photoUrl")
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(200).json({
      message: "Error while featching connection",
      error: err.message,
    });
  }
});

module.exports = router;
