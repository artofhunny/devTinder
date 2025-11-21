const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../model/connectRequest");
const User = require("../model/user");

const router = express.Router();

router.post("/request/send/:status/:userId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;

    if (!["interested", "ignored"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status type: " + status });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res
        .status(400)
        .json({ message: "Invalid receiver id: " + toUserId });
    }

    if (fromUserId.toString() === toUserId.toString()) {
      return res
        .status(400)
        .json({ message: "Invalid receiver id: " + toUserId });
    }

    const isConnectionAlreadyExist = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (isConnectionAlreadyExist) {
      return res
        .status(400)
        .json({
          message: "Connection already exist: " + isConnectionAlreadyExist,
        });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    await connectionRequest.save();
    res.json({ message: "Request sent" });
  } catch (err) {
    res.send("Error : " + err.message);
  }
});

router.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const logedinUser = req.user;

      if (!["accepted", "rejected"].includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type", data: status });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: logedinUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request not found", data: status });
      }

      connectionRequest.status = status;
      await connectionRequest.save();

      res.json({ message: `Connection request ${status}`, data: status });
    } catch (err) {
      res.send("Error : " + err.message);
    }
  }
);

module.exports = router;
