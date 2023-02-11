import React, { lazy, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { AnimatePresence } from "framer-motion";
import { Box } from "@chakra-ui/react";

const NewsContainer = lazy(() => import("./pages/News"));
const FundDetail = lazy(() => import("./pages/FundDetail"));
const NotFoundPage = lazy(() => import("./pages/404"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Header = lazy(() => import("./components/Header"));
const Footer = lazy(() => import("./components/Footer"));
const Home = lazy(() => import("./pages/Home"));
const Disclosures = lazy(() => import("./pages/Disclosures"));
const TandC = lazy(() => import("./pages/TandC"));
const News = lazy(() => import("./pages/News"));
const Funds = lazy(() => import("./pages/Funds"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));

function App() {
  const location = useLocation();
  return (
    <Box>
      <Header />
      <AnimatePresence exitBeforeEnter>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclosures" element={<Disclosures />} />
          <Route path="/tc" element={<TandC />} />
          <Route path="/fund/:id" element={<FundDetail />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/news" element={<News />} />
          <Route path="/newsletter/unsubscribe" element={<Unsubscribe />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </Box>
  );
}

export default App;
