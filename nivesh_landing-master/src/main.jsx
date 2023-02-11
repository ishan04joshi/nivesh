import "./index.css";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React, { Suspense } from "react";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import Loader from "./components/Loader";
import ReactDOM from "react-dom/client";
import theme from "./theme/index";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeScript initialColorMode="light" />
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <App />
        </Suspense>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
