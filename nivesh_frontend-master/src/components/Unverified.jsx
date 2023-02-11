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
    <Alert status="error">
      <AlertIcon />
      <Box>
        <AlertTitle>Incomplete Profile or Pending Admin Approval!</AlertTitle>
        <AlertDescription>
          Your profile details are either Incomplete or It's for approval by
          Admin. You wont be able to purchase funds yet.
        </AlertDescription>
      </Box>
    </Alert>
  );
};

export default Unverified;
