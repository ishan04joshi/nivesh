const Guest = require("../schema/Guest");
const router = require("express").Router();
const Joi = require("joi");
const Request = require("../schema/Request");
const Resident = require("../schema/Resident");
const { sendNewRequestNotification } = require("../helpers/notification");
const { verifyToken } = require("../middlewares/tokenVerification");
const { getValueRedis } = require("../init_redis");
const { sendRequestSMS } = require("../helpers/sms");
const Log = require("../schema/Log");

router.post("/new/request", async (req, res) => {
  const { faceId, reqFor, reason } = req.body;
  const validation = Joi.object({
    faceId: Joi.string().required(),
    reqFor: Joi.array().unique().required(),
    reason: Joi.string(),
  });
  const { error } = validation.validate({
    faceId,
    reqFor,
    reason,
  });
  if (error) {
    return res.status(200).json({
      status: false,
      error: true,
      message: error.details[0].message,
    });
  }
  try {
    const residents = await Resident.find({ _id: { $in: reqFor } });
    if (residents.length === 0)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No resident found with this reqFor array.",
      });

    const guest = await Guest.findOne({ _id: faceId });
    if (!guest)
      return res
        .status(200)
        .json({ status: false, error: true, message: "Invalid faceId." });

    let reqres = [];
    for (let resident of residents) {
      if (!resident.approvedGuests.includes(faceId)) {
        let request = await Request.create({
          faceId,
          reqFor: resident._id,
          reason,
        });
        request = await Request.findOne({ _id: request._id }).populate(
          "faceId"
        );
        await sendNewRequestNotification(resident.pushToken, request);
        const value = await getValueRedis(resident.pushToken);

        if (value !== null && value !== undefined) {
          req.io.to(value.id).emit("newRequest", request);
        }
        sendRequestSMS(resident.mobile, request.faceId).catch((err) => {
          console.log(err);
        });
        await Resident.updateOne(
          {
            _id: resident._id,
          },
          {
            $push: {
              requests: request._id,
            },
          }
        );
        reqres.push(request);
      } else {
        const request = await Request.create({
          faceId,
          reqFor: resident._id,
          reason,
          status: "approved",
        });
        const exists = await Log.find({ user: resident._id });
        if (exists.length === 0) {
          await Log.create({
            user: resident._id,
            accepted: [request._id],
            rejected: [],
          });
        } else {
          await Log.updateOne(
            {
              user: resident._id,
            },
            {
              $push: {
                accepted: request._id,
              },
            }
          );
        }
      }
    }
    res.status(200).json({
      status: true,
      error: false,
      message: "Requests Created , Resident is Being Notified.",
      data: reqres,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      error: true,
      message: "Internal Server Error",
    });
  }
});

router.get("/request/status/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const request = await Request.findById(id);
    if (!request)
      return res
        .status(200)
        .json({ error: true, status: false, message: "Request Not Found" });
    res.status(200).json({
      status: true,
      error: false,
      message: "Request Found",
      request,
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      error: true,
      message: "Internal Server Error",
    });
  }
});

router.get("/data/requests", verifyToken, async (req, res) => {
  const { _id } = req.user;
  try {
    const requests = await Resident.findById(_id)
      .select("-password")
      .populate({
        path: "requests",
        populate: {
          path: "faceId",
        },
      });

    res.status(200).json({
      status: true,
      error: false,
      message: "Requests Fetched Successfully",
      data: requests,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      error: true,
      message: "Internal Server Error",
    });
  }
});

router.get("/requests/history", verifyToken, async (req, res) => {
  const { _id } = req.user;

  try {
    const requests = await Request.find({ reqFor: _id })
      .populate("faceId")
      .sort({
        createdAt: -1,
      });
    res.status(200).json({
      status: true,
      error: false,
      message: "Requests Fetched Successfully",
      data: requests,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      error: true,
      message: "Internal Server Error",
    });
  }
});

router.get("/requests/pending", verifyToken, async (req, res) => {
  const { _id } = req.user;

  try {
    const requests = await Request.find({
      reqFor: _id,
      status: "pending",
    })
      .populate("faceId")
      .sort({
        createdAt: -1,
      });
    res.status(200).json({
      status: true,
      error: false,
      message: "Requests Fetched Successfully",
      data: requests,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      error: true,
      message: "Internal Server Error",
    });
  }
});

router.get("/request/accept/:_id", verifyToken, async (req, res) => {
  const { _id } = req.user;
  const { _id: reqId } = req.params;
  try {
    const request = await Request.findById(reqId);
    if (request.reqFor.toString() !== _id.toString())
      return res.status(200).json({
        error: true,
        status: false,
        message: "You are not Authorized to Accept this Request",
      });
    if (request.status !== "pending")
      return res.status(200).json({
        error: true,
        status: false,
        message: "Request is Already Accepted or Rejected",
      });
    await Request.updateOne(
      {
        _id: reqId,
      },
      {
        $set: {
          status: "accepted",
        },
      }
    );
    const exists = await Log.find({ user: _id });
    if (exists.length === 0) {
      await Log.create({ user: _id, accepted: [request._id], rejected: [] });
    } else {
      await Log.updateOne(
        {
          user: _id,
        },
        {
          $push: {
            accepted: request._id,
          },
        }
      );
    }
    await Resident.updateOne(
      {
        _id: request.reqFor,
      },
      {
        $pull: {
          requests: request._id,
        },
      }
    );
    res.status(200).json({
      status: true,
      error: false,
      message: "Request Accepted Successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      error: true,
      message: "Internal Server Error",
    });
  }
});

router.get("/request/reject/:_id", verifyToken, async (req, res) => {
  const { _id } = req.user;
  const { _id: reqId } = req.params;
  try {
    const request = await Request.findById(reqId);
    if (request.reqFor.toString() !== _id.toString())
      return res.status(200).json({
        error: true,
        status: false,
        message: "You are not Authorized to Reject this Request",
      });
    if (request.status !== "pending")
      return res.status(200).json({
        error: true,
        status: false,
        message: "Request is Already Accepted or Rejected",
      });
    await Request.updateOne(
      {
        _id: reqId,
      },
      {
        $set: {
          status: "rejected",
        },
      }
    );
    const exists = await Log.find({ user: _id });
    if (exists.length === 0) {
      await Log.create({ user: _id, accepted: [], rejected: [request._id] });
    } else {
      await Log.updateOne(
        {
          user: _id,
        },
        {
          $push: {
            rejected: request._id,
          },
        }
      );
    }
    await Resident.updateOne(
      {
        _id: request.reqFor,
      },
      {
        $pull: {
          requests: request._id,
        },
      }
    );
    res.status(200).json({
      status: true,
      error: false,
      message: "Request Rejected Successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      error: true,
      message: "Internal Server Error",
    });
  }
});

router.get("/data/request/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(200)
      .json({ status: false, error: true, message: "No Id Provided" });

  try {
    const request = await Request.findById(id).populate("faceId");
    if (request === null || request === undefined)
      return res.status(200).json({
        status: false,
        error: true,
        message: "No Request Found for this ID",
      });
    res.status(200).json({
      status: true,
      error: false,
      message: "Request Fetched Successfully",
      data: request,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      error: true,
      message: "Internal Server Error",
    });
  }
});

router.get("/data/stats", verifyToken, async (req, res) => {
  const { _id } = req.user;
  try {
    const residents = await Resident.find({
      _id: { $ne: _id },
    }).count();
    const requests = await Request.find({}).count();
    const totalRequests = await Request.find({ reqFor: _id }).count();
    const acceptedRequests = await Request.find({
      reqFor: _id,
      status: "accepted",
    }).count();
    res.status(200).json({
      status: true,
      error: false,
      message: "Stats Fetched Successfully",
      data: {
        residents,
        requests,
        totalRequests,
        acceptedRequests,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: false,
      error: true,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
