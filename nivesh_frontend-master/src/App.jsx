import React, { lazy, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import { AnimatePresence } from "framer-motion";
import News from "./pages/News";
import UserDashboard from "./pages/UserDashboard";
import { fetchUser } from "./api/apis";
import useStore from "./store/store";

const Newsletter = lazy(() => import("./pages/Newsletter"));
const MarketValues = lazy(() => import("./pages/MarketValues"));
const Withdrawals = lazy(() => import("./pages/Withdrwals"));
const Statements = lazy(() => import("./pages/Statements"));
const Orders = lazy(() => import("./pages/Orders"));
const About = lazy(() => import("./pages/About"));
const FundUpdate = lazy(() => import("./pages/FundUpdate"));
const AuthLanding = lazy(() => import("./pages/AuthLanding"));
const Contact = lazy(() => import("./pages/Contact"));
const Home = lazy(() => import("./pages/Home"));
const AllUsers = lazy(() => import("./pages/AllUsers"));
const NotFoundPage = lazy(() => import("./pages/404"));
const Funds = lazy(() => import("./pages/Funds"));
const Pending = lazy(() => import("./pages/Pending"));
const PendingRegistrations = lazy(() => import("./pages/PendingRegistrations"));
const FundManager = lazy(() => import("./pages/FundManager"));
const FundDetail = lazy(() => import("./pages/FundDetail"));
const Register = lazy(() => import("./pages/Register"));
const Sidebar = lazy(() => import("./components/Sidebar"));
const SignIn = lazy(() => import("./pages/SignIn"));
const InitialBuy = lazy(() => import("./pages/InitialBuy"));
const Payment = lazy(() => import("./pages/Payment"));
const Success = lazy(() => import("./pages/Success"));
const Subscription = lazy(() => import("./pages/Subscription"));
const SupportRequests = lazy(() => import("./pages/SupportRequests"));
const Subscribers = lazy(() => import("./pages/Subscribers"));

function App() {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const sessionExpired = useStore((state) => state.sessionExpired);
  // const { user, setUser } = useStore();

  useEffect(() => {
    if (sessionExpired === true) return navigate("/signin");
    if (!user) {
      fetchUser()
        .then(({ data }) => {
          console.log(data);
          if (data.status) {
            setUser(data.data);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [user, sessionExpired]);
  useEffect(() => {
    fetchUser()
      .then(({ data }) => {
        console.log(data);
        if (data.status) {
          setUser(data.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <AnimatePresence>
      <Routes>
        <Route path="/" element={<Sidebar />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="funds" element={<Funds />} />
          <Route path="funds/manager" element={<FundManager />} />
          <Route path="fund/:id" element={<FundDetail />} />
          <Route path="update/fund/:id" element={<FundUpdate />} />
          <Route path="buy/:id" element={<InitialBuy />} />
          <Route path="payment" element={<Payment />} />
          <Route path="success/:id" element={<Success />} />
          <Route path="orders" element={<Orders />} />
          <Route path="news" element={<News />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="withdrawals" element={<Withdrawals />} />
          <Route path="statements" element={<Statements />} />
          <Route path="market-values" element={<MarketValues />} />
          <Route path="support" element={<SupportRequests />} />
          <Route path="newsletter" element={<Newsletter />} />
          <Route path="subscribers" element={<Subscribers />} />
          <Route
            path="pending/registrations"
            element={<PendingRegistrations />}
          />
          <Route path="profile" element={<Register />} />
          {/* <Route path="register" element={<Register />} /> */}
        </Route>
        <Route path="/signup" element={<AuthLanding />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/success/pending" element={<Pending />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
