const axios = require("axios");
const sendNewRequestNotification = async (pushToken, request) => {
  const message = {
    to: pushToken,
    sound: "default",
    title: "New Pending Request",
    body: "You have a new pending request, A new guest wants to visit your house",
    data: request,
  };

  await axios
    .post("https://exp.host/--/api/v2/push/send", JSON.stringify(message), {
      method: "POST",
      headers: {
        host: "exp.host",
        accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    })
    .catch((e) => console.log(e));
};

module.exports = { sendNewRequestNotification };
