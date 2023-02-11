import Axios from "axios";
import { backendURL } from "../env";
import useStore from "../store/store";
export const prefix = "/api/v1";
export const baseurl = backendURL;
export const url = baseurl + prefix;
const API = Axios.create({ baseURL: url, withCredentials: true });

API.interceptors.response.use(
  (res) => {
    // Add configurations here
    return res;
  },
  (err) => {
    if (err?.response?.status === 401) {
      console.log(err);
      useStore.setState({
        sessionExpired: true,
      });
      // window.location.href = "/login";
      // window.location = "/login";
      return Promise.reject(err);
    }
  }
);

export const fetchUser = async () => API.get("/user");
export const getNotifications = async () => API.get("/notifications");
export const clearNotification = async (id) =>
  API.delete(`/notification/${id}`);
export const clearAllNotifications = async () => API.delete(`/notifications`);
export const requestPin = async (phone) => API.get("/request/pin/" + phone);

export const sendRegisterOtp = async (phone, email) =>
  API.post("/register/send-otp", { phone, email });

export const verifyRegisterOtp = async (phone, phoneOtp, email, emailOtp) =>
  API.post("/register/verify-otp", { phone, phoneOtp, email, emailOtp });

export const updateUserProfile = async (body) =>
  API.put("/update/registration", body);

export const sendLoginOtp = async (id, pin) =>
  API.post("/login/send-otp", { id, pin });

export const verifyLoginOtp = async (id, pin, otp) =>
  API.post("/login", { id, pin, otp });

export const getUsers = async (page, size) =>
  API.get(`/users?page=${page}&size=${size}`);

export const getSpecificUser = async (_id) => API.post(`/user`, { _id });

export const getPendingRegistrations = async (page, size) =>
  API.get(`/users/pending?page=${page}&size=${size}`);

export const updatePendingUserToVerified = async (_id) =>
  API.put(`/user/verified`, { _id });

export const updatePendingUserToRejected = async (_id, reason) =>
  API.put(`/user/reject`, { _id, reason });

export const updatePendingUserToApproved = async (_id) =>
  API.put(`/user/verified`, { _id });

export const updateUserToBlocked = async (_id) =>
  API.put(`/user/block`, { _id });

export const updateUserToUnblocked = async (_id) =>
  API.put(`/user/unblock`, { _id });

export const newFund = async (body) => API.post(`/new/fund`, body);
export const getAllFunds = async (page, size) =>
  API.get(`/funds?page=${page}&size=${size}`);
export const getSpecificFund = async (_id) => API.get(`/fund/${_id}`);
export const updateFund = async (body) => API.post(`/update/fund`, body);
export const buyNow = async (body) => API.post(`/buy`, body);
export const paymentStatus = async (body) => API.post("/status", body);
export const getMerchantKey = async () => API.get("/merchant/key");

export const getOrdersByFilter = async (page, size) =>
  API.get(`/orders?page=${page}&size=${size}`);

export const assignOrder = async (body) => API.post(`/assign/order`, body);
export const getSpecificOrder = async (_id) => API.get(`/order/${_id}`);

export const getAllNews = async (page, size) =>
  API.get(`/news/all_news_paged?page=${page}&size=${size}`);

export const addNews = async (body) => API.post(`/news/add`, body);

export const deleteNews = async (_id) => API.delete(`/news/${_id}`);

export const getAllWithdrawals = async (page, size) =>
  API.get(`/withdrawals?page=${page}&size=${size}`);

export const completeWithdrawal = async (body) =>
  API.put(`/withdrawals/complete`, body);
export const rejectedWithdrawal = async (body) =>
  API.put(`/withdrawals/rejected`, body);

export const approveWithdrawal = async (body) =>
  API.put(`/withdrawals/approve`, body);

export const createWithdrawal = async (body) =>
  API.post(`/withdrawals/create`, body);

// export const emptyMailbox = async () => API.put(`/user/mailbox/empty`);

export const getAllSubscriptions = async (page, size) =>
  API.get(`/subscriptions?page=${page}&size=${size}`);

export const createStatement = async (body) =>
  API.post(`/statements/create`, body);
export const getAllStatements = async (page, size) =>
  API.get(`/statements?page=${page}&size=${size}`);
export const rejectStatement = async (body) =>
  API.put(`/statements/rejected`, body);
export const completeStatement = async (body) =>
  API.put(`/statements/completed`, body);

export const pauseSubscription = async (id) =>
  API.post(`/subscription/pause`, { id });
export const resumeSubscription = async (id) =>
  API.post(`/subscription/resume`, { id });
export const cancelSubscription = async (id) =>
  API.post(`/subscription/cancel`, { id });
export const syncSubscription = async (id) =>
  API.post(`/subscription/sync`, { id });

export const getMarketValues = async (id) => API.get("/market-values");
export const updateMarketValues = async (user, fund, value) =>
  API.put(`/market-value`, { user, fund, value });
export const getSupportRequests = async (page, size) =>
  API.get(`/support/all_paged?page=${page}&size=${size}`);
export const completeSRequest = async (id) =>
  API.put(`/support/complete`, { id });

export const sendNewsletter = async (subject, message) =>
  API.post("/newsletter/send", { subject, message });

export const logout = async () => API.get("/logout");
export const getSubscribers = async (page, size) =>
  API.get(`/newsletter?page=${page}&size=${size}`);

export const deleteSubscriber = async (email) =>
  API.get("/newsletter/unsubscribe/" + email);
