const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");

cron.schedule("15 18 * * *", async () => {
  try {
    const yesterDay = subDays(new Date(), 0);
    const startofDay = startOfDay(yesterDay);
    const endofDay = endOfDay(yesterDay);
    const pendingConnectionRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: startofDay,
        $lt: endofDay,
      },
    }).populate("toUserId");
    const userSet = new Set();
    pendingConnectionRequests.forEach((req) => {
      userSet.add(req.toUserId.emailId);
    });
    const emailList = Array.from(userSet);

    for (const email of emailList) {
      const emailRes = await sendEmail.run(
        `Connection request sent to ${email}`,
        `Login to accept or reject the connection request`
      );
    }
  } catch (err) {
    throw new Error(err.message);
  }
});
