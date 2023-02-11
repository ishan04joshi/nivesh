import Axios from "axios";
import useStore from "../store/store";
import { backendURL } from "../constants";
export const prefix = "/api/v1";
export const baseurl = backendURL;
export const url = baseurl + prefix;
export const API = Axios.create({ baseURL: url, withCredentials: true });

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

export const getAllNews = async () => API.get(`/news`);

export const subscribeNewsletter = async (body) =>
  API.post(`/newsletter/add_user`, body);
export const getAllFunds = async () => API.get(`/funds`);
export const getSpecificFund = async (_id) => API.get(`/fund/${_id}`);
export const submitSupportRequest = async (body) => API.post(`/support`, body);
export const unsubscribeNewsletter = async (body) =>
  API.get("/newsletter/unsubscribe/" + body);
