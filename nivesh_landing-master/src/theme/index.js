import "@fontsource/dm-serif-display";
import "@fontsource/dm-serif-text";
import "@fontsource/poppins";

import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "DM Serif Display",
    body: "Poppins",
  },
  config: {
    useSystemColorMode: false,
    initialColorMode: "light",
  },
  colors: {
    brand: {
      50: "#F7FAFC",
      100: "#EDF2F7",
      200: "#E2E8F0",
      300: "#CBD5E0",
      400: "#A0AEC0",
      500: "#718096",
      600: "#4A5568",
      700: "#2D3748",
      800: "#1A202C",
      900: "#0A0F14",
    },
  }
});

export default theme;
