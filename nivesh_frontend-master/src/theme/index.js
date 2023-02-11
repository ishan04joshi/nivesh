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
});

export default theme;
