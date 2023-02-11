import "react-quill/dist/quill.snow.css";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  StackDivider,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Textarea,
  VStack,
  chakra,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { addNews, baseurl, deleteNews, getAllNews, url } from "../api/apis";

import EmptyLottie from "../assets/lottie/emptyRecords.json";
import LottiePlayer from "lottie-react";
import Pagination from "@choc-ui/paginator";
import ReactQuill from "react-quill";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import parser from "html-react-parser";
import toIndianCurrency from "../helper";
import { useMemo } from "react";
import useStore from "../store/store";

const MotionStack = motion(Stack);
const MotionBox = motion(Box);

const boxVariants = {
  hidden: {
    scale: 0,
  },
  animate: {
    scale: 1,
    transition: {
      staggerChildren: 0.5,
      delayChildren: 0.4,
    },
  },
};

const listVariant = {
  hidden: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

const News = () => {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [news, setNews] = useState([]);
  const [specificUserId, setSpecificUserId] = useState(null);
  const [fetchingUser, setFetchingUser] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newsTitle, setNewsTitle] = useState("");
  const { user } = useStore();
  const [newsDescription, setNewsDescription] = useState("");
  const [newsImage, setNewsImage] = useState(null);
  const [newsCategory, setNewsCategory] = useState("");
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedNews, setSelectedNews] = useState(null);
  const [edit, setEdit] = useState(false);

  const filteredNews = useMemo(() => {
    if (!search.trim()) return news;
    return news.filter((s) =>
      s?.heading?.toLowerCase()?.includes(search.toLowerCase())
    );
  }, [news, search]);

  const handleGetAllNews = async () => {
    try {
      const { data } = await getAllNews(page, size);
      if (data.error)
        return toast({
          title: "Error",
          description: data?.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });

      setNews(data.data);
      setCount(data.count);
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };
  const handleDeleteNews = async (id) => {
    try {
      const { data } = await deleteNews(id);
      if (data.status) {
        handleGetAllNews();
        return toast({
          title: "Success",
          description: data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      }
    } catch (e) {}
  };
  const handleAddNews = async () => {
    if (!newsTitle || !newsDescription || !newsCategory)
      return toast({
        title: "Error",
        description:
          "Invalid details, Please Verify if you have upload image along with other details.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });

    if (!edit)
      if (!newsImage)
        return toast({
          title: "Error",
          description: "Invalid Image",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });

    try {
      const formData = new FormData();
      if (edit) {
        if (newsTitle && newsTitle !== selectedNews?.heading)
          formData.append("heading", newsTitle);
        if (newsDescription && newsDescription !== selectedNews?.description)
          formData.append("description", newsDescription);
        if (newsCategory && newsCategory !== selectedNews?.category)
          formData.append("category", newsCategory);
        if (typeof newsImage !== "string") formData.append("image", newsImage);
        formData.append("id", selectedNews?._id);
        formData.append("edit", true);
      } else {
        formData.append("heading", newsTitle);
        formData.append("description", newsDescription);
        formData.append("image", newsImage);
        formData.append("category", newsCategory);
      }
      const { data } = await addNews(formData);
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });

      handleGetAllNews();
      resetNewsForm();
      onClose();
      setSelectedNews(null);
      setEdit(false);
      setNewsTitle("");
      setNewsDescription("");
      setNewsImage(null);
      setNewsCategory("");
      return toast({
        title: "Success",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "Could not get news details",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  const resetNewsForm = () => {
    setNewsTitle("");
    setNewsDescription("");
    setNewsImage(null);
    setNewsCategory("");
  };
  useEffect(() => {
    handleGetAllNews();
  }, [page, size]);

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        pb: 4,
        // justifyContent: "center",
        // bg: "red",
      }}
    >
      <Stack
        direction={{
          base: "column",
          md: "row",
        }}
        justifyContent={"space-between"}
      >
        <Heading color="gray.600">News Management</Heading>
        <Stack spacing={3} direction="row">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            maxW="150px"
          />
          {user?.isAdmin && (
            <Button colorScheme={"blue"} onClick={onOpen}>
              Add a news
            </Button>
          )}
        </Stack>
      </Stack>

      <Modal
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        scrollBehavior="inside"
        size={useBreakpointValue({
          base: "sm",
          sm: "md",
          md: "md",
          lg: "6xl",
          xl: "6xl",
        })}
        sx={{ mx: 2 }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add News</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={{ base: 6, md: 10 }}>
              <Input
                value={newsTitle}
                placeholder="heading"
                id="name"
                required
                type="text"
                size="md"
                onChange={(e) => setNewsTitle(e.target.value)}
              />
              <ReactQuill
                theme="snow"
                value={newsDescription}
                onChange={setNewsDescription}
              />

              <RadioGroup value={newsCategory} onChange={setNewsCategory}>
                <Stack direction="row">
                  <Radio value="Market News">Market News</Radio>
                  <Radio value="Important Announcement">
                    Important Announcement
                  </Radio>
                </Stack>
              </RadioGroup>
              <Text>Image</Text>
              {edit && (
                <Image
                  objectFit="contain"
                  w="100px"
                  h="70px"
                  src={baseurl + "/assets/" + newsImage}
                  alt={newsTitle}
                  fallbackSrc="https://via.placeholder.com/150"
                />
              )}
              <Input
                //check filetype+ file szie
                type="file"
                onChange={(e) => setNewsImage(e.target.files[0])}
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Stack direction="row" spacing={2}>
              <Button
                variant="solid"
                colorScheme="blue"
                onClick={(e) => handleAddNews(e)}
              >
                {edit ? "Save News" : "Add News"}
              </Button>

              <Button onClick={onClose}>Close</Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <MotionStack
        variants={boxVariants}
        initial="hidden"
        animate="animate"
        direction="column"
        spacing={2}
        sx={{
          px: {
            sm: 2,
            lg: 6,
          },
          pt: 4,
        }}
      >
        {filteredNews?.length === 0 && (
          <Stack
            direction="column"
            spacing={3}
            justifyContent="center"
            alignItems="center"
            h="80vh"
            // bg="red"
          >
            <LottiePlayer
              animationData={EmptyLottie}
              autoPlay={true}
              loop={true}
              style={{ height: "60vh", width: "60vw" }}
            />
            <Heading>No News Found</Heading>
          </Stack>
        )}
        <Accordion defaultIndex={[0]}>
          <Stack spacing={3}>
            {filteredNews?.map((n, idx) => (
              <AccordionItem>
                <MotionBox
                  variants={listVariant}
                  px={{
                    sm: 2,
                    lg: 6,
                  }}
                  py={{
                    sm: 2,
                    lg: 4,
                  }}
                  rounded="lg"
                  shadow="lg"
                  bg={useColorModeValue("white", "gray.800")}
                  maxW="100%"
                  key={idx + n._id}
                >
                  <Stack
                    direction={{
                      base: "column",
                      md: "row",
                    }}
                    spacing={2}
                    justifyContent="space-between"
                  >
                    <AccordionButton _focus={{ border: "0px" }}>
                      <Stack
                        ml={{
                          base: 0,
                          md: 2,
                        }}
                        w="100%"
                        direction={{
                          base: "column",
                          md: "row",
                        }}
                        spacing={4}
                        // alignItems="center"
                        justifyContent="space-between"
                        textAlign="left"
                      >
                        <Stack
                          spacing={1}
                          direction={{
                            base: "column",
                            md: "row",
                          }}
                        >
                          <Image
                            objectFit="contain"
                            w="100px"
                            h="70px"
                            src={baseurl + "/assets/" + n?.image}
                            alt={n?.heading}
                            fallbackSrc="https://via.placeholder.com/150"
                          />
                          <Stack direction="column" spacing={1}>
                            <Heading size="md">{n?.heading}</Heading>
                            <Tag size="sm" colorScheme="blue" w="fit-content">
                              {n?.category}
                            </Tag>
                            <Tag size="sm" colorScheme="green" w="fit-content">
                              {dayjs(n?.date).format("DD-MM-YYYY")}
                            </Tag>
                          </Stack>
                        </Stack>
                        <Stack spacing={1}>
                          <Button
                            onClick={() => {
                              setNewsTitle(n?.heading);
                              setNewsDescription(n?.description);
                              setNewsCategory(n?.category);
                              setNewsImage(n?.image);
                              setSelectedNews(n);
                              setEdit(true);
                              onOpen();
                            }}
                            colorScheme="green"
                            size="sm"
                            variant="solid"
                            w="fit-content"
                            alignSelf="flex-end"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteNews(n?._id)}
                            colorScheme="red"
                            size="sm"
                            variant="solid"
                            w="fit-content"
                            alignSelf="flex-end"
                          >
                            Delete
                          </Button>
                        </Stack>
                      </Stack>
                      {/* <AccordionIcon /> */}
                    </AccordionButton>
                  </Stack>
                  <AccordionPanel pb={4}>
                    {parser(n?.description)}
                  </AccordionPanel>
                </MotionBox>
              </AccordionItem>
            ))}
          </Stack>
        </Accordion>
      </MotionStack>
      <Box>
        {filteredNews?.length > 0 && (
          <Pagination
            defaultPageSize={size}
            defaultPage={page}
            total={count}
            paginationProps={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2em",
            }}
            pageNeighbours={1}
            showQuickJumper
            responsive
            onChange={(page) => setPage(page)}
            onShowSizeChange={(size, e) => setSize(parseInt(e))}
            showSizeChanger
          />
        )}
      </Box>
    </Box>
  );
};

export default News;
