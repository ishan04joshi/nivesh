import "react-quill/dist/quill.snow.css";

import { Box, Button, Heading, Input, Stack, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import ReactQuill from "react-quill";
import { sendNewsletter } from "../api/apis";
import useStore from "../store/store";

const Newsletter = () => {
  const toast = useToast();
  const { user } = useStore();
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSendNewsLetter = async () => {
    try {
      if (!subject || !message) return toast({ title: "Fill all fields" });
      setLoading(true);
      const { data } = await sendNewsletter(subject, message);
      setLoading(false);
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });

      toast({
        title: "Success",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (e) {
      setLoading(false);
      console.error(e);
      toast({
        title: "Error",
        description: e?.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        pb: 4,
        px: 2,
        py: 4,
        // justifyContent: "center",
        // bg: "red",
      }}
    >
      <Stack direction="row" justifyContent={"space-between"}>
        <Heading color="gray.600">Send Newsletter</Heading>
        {!user?.isAdmin && (
          <Button colorScheme={"blue"} onClick={onOpen}>
            Request New Statement
          </Button>
        )}
      </Stack>
      <Stack spacing={3} bg="white" rounded="lg" p={2} mt={6}>
        <Input
          placeholder="Subject"
          onChange={(e) => setSubject(e.target.value)}
        />
        <ReactQuill theme="snow" value={message} onChange={setMessage} />
      </Stack>
      <Button
        variant="solid"
        colorScheme={"blue"}
        mt={4}
        justifyContent="flex-end"
        w="fit-content"
        isLoading={loading}
        isDisabled={loading}
        onClick={handleSendNewsLetter}
      >
        SEND
      </Button>
    </Box>
  );
};

export default Newsletter;
