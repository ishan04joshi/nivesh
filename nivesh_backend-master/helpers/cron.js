const User = require("../schema/User");
const Subscription = require("../schema/Subscription");
const cron = require("node-cron");
const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET,
});

const updateSubscriptions = () =>
  new Promise(async (resolve, reject) => {
    try {
      const allSubscriptions = await Subscription.find({});

      for (let user of allSubscriptions) {
        const subscriptionDetail = await Subscription.findOne({
          _id: user._id,
        })
          .populate({
            path: "subscriptions",
            populate: {
              path: "fund",
            },
          })
          .populate("user")
          .sort({ createdAt: -1 });
        const userDetails = await User.findById(subscriptionDetail.user._id);
        for (let sub of subscriptionDetail.subscriptions) {
          const subDetails = await instance.subscriptions.fetch(
            sub.subscription
          );
          const planDetails = await instance.plans.fetch(subDetails.plan_id);

          sub.status = subDetails.status;
          sub.paidCounts = subDetails.paid_count;
          sub.remainingCounts = subDetails.remaining_count;
          sub.amount = planDetails.item.amount / 100;

          const fundExists = userDetails.funds.find(
            (f) => f.id.toString() === sub.fund._id.toString()
          );
          if (!fundExists) {
            userDetails.funds.push({
              id: sub.fund._id,
              marketValue: 0,
              recurringTotal:
                +subDetails.paid_count * (planDetails.item.amount / 100),
            });
          } else {
            fundExists.recurringTotal =
              +subDetails.paid_count * (planDetails.item.amount / 100);
          }
          await userDetails.save();
          await subscriptionDetail.save();
        }
      }
      resolve();
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });

cron.schedule("0 */12 * * *", async () => {
  console.warn("RUNNING CRON");

  await updateSubscriptions();
  console.log("cron job is running");
});
