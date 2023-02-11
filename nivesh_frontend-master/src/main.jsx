import "./index.css";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React, { Suspense } from "react";

import { AnimatePresence } from "framer-motion";
import App from "./App";
import { AppError } from "./AppError";
import { BrowserRouter } from "react-router-dom";
import Loader from "./components/Loader";
import ReactDOM from "react-dom/client";
import theme from "./theme/index";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <ChakraProvider resetCSS theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <AppError>
      <BrowserRouter>
        <AnimatePresence exitBeforeEnter>
          <Suspense fallback={<Loader />}>
            <App />
          </Suspense>
        </AnimatePresence>
      </BrowserRouter>
    </AppError>
  </ChakraProvider>
  // </React.StrictMode>
);
