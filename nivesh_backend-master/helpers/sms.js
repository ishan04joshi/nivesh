const axios = require("axios");

const sendSMSOtp = async (phone, otp) =>
  axios.post(
    "https://www.fast2sms.com/dev/bulkV2",
    {
      route: "v3",
      sender_id: "Cghpet",
      message: `Code: ${otp}. APPNAME - Please Do Not Share the OTP with anyone, This OTP is Only Valid for 2mins.`,
      language: "english",
      flash: 0,
      numbers: phone,
    },
    {
      headers: {
        authorization: process.env.SMS_KEY,
        "Content-Type": "application/json",
      },
    }
  );

const sendRequestSMS = async (phone, data) =>
  axios.post(
    "https://www.fast2sms.com/dev/bulkV2",
    {
      route: "v3",
      sender_id: "Cghpet",
      message: `Mr/Mrs: ${data.firstName} ${data.lastName} has requested to meet you with Reason: ${data.reason}.
       Please Approve or Reject the Request In Resident's | NS. http://residents-ns://`,
      language: "english",
      flash: 0,
      numbers: phone,
    },
    {
      headers: {
        authorization: process.env.SMS_KEY,
        "Content-Type": "application/json",
      },
    }
  );

const sendPinOverSMS = async (phone, pin) => {
  axios.post(
    "https://www.fast2sms.com/dev/bulkV2",
    {
      route: "v3",
      sender_id: "Cghpet",
      message: `Your PIN is ${pin}. Please use the PIN to login to your Niveshkro account.`,
      language: "english",
      flash: 0,
      numbers: phone,
    },
    {
      headers: {
        authorization: process.env.SMS_KEY,
        "Content-Type": "application/json",
      },
    }
  );
};

module.exports = { sendSMSOtp, sendRequestSMS, sendPinOverSMS };
