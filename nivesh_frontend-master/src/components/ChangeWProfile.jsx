import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
} from "@chakra-ui/react";

import React from "react";

const Unverified = () => {
  return (
    <Alert status="error" sx={{ mb: 5 }}>
      <AlertIcon />
      <Box>
        <AlertTitle>Rules!</AlertTitle>
        <AlertDescription>
          Editing Any Detail would require you to re write every detail and
          upload every picture again for approval.
        </AlertDescription>
      </Box>
    </Alert>
  );
};

export default Unverified;
