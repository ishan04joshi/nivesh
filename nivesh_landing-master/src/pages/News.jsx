import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  GridItem,
  Image,
  Link,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  chakra,
  useToast,
} from "@chakra-ui/react";
import { baseurl, getAllNews, url } from "../api/index";
import { useEffect, useMemo } from "react";

import Loader from "../components/Loader";
import React from "react";
import dayjs from "dayjs";
import parser from "html-react-parser";

const News = ({ news }) => {
  if (!news) return null;
  return (
    <Flex flexGrow={1}>
      <Box
        mx="auto"
        rounded="lg"
        shadow="md"
        bg="white"
        _dark={{
          bg: "gray.800",
        }}
        maxW="4xl"
        my={6}
      >
        <Image
          roundedTop="lg"
          w="full"
          // h='560px'
          fit="contain"
          src={baseurl + "/assets/" + news?.image}
          alt="Article"
        />

        <Box p={6}>
          <Box>
            <Flex gap={4} mb={4}>
              <Badge colorScheme={"teal"} rounded="full" px="2">
                {news?.category}
              </Badge>
            </Flex>
            <Text display="block" color="blackAlpha.800" fontWeight="bold" fontSize="2xl" mt={2}>
              {news?.heading}
            </Text>
            <chakra.p
              mt={2}
              fontSize="lg"
              color="blackAlpha.600"
              _dark={{
                color: "gray.400",
              }}
            >
              {parser(news?.description)}
            </chakra.p>
          </Box>

          <Box mt={4}>
            <Flex alignItems="center">
              <chakra.span
                mx={1}
                fontSize="sm"
                color="gray.600"
                _dark={{
                  color: "gray.300",
                }}
              >
                {dayjs(news?.date).format("DD MMM YYYY")}
              </chakra.span>
            </Flex>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

const SingleNews = ({ data: { heading, description, image, createdAt, _id }, setActiveNewsId }) => {
  return (
    <Flex w="full">
      <Box rounded="lg" bg="white">
        <Box mt={2}>
          <Link
            fontSize="2xl"
            color="gray.700"
            _dark={{
              color: "white",
            }}
            fontWeight="700"
            _hover={{
              color: "gray.600",
              _dark: {
                color: "gray.200",
              },
              textDecor: "underline",
            }}
            textAlign="left"
            onClick={() => setActiveNewsId(_id)}
          >
            {heading}
          </Link>
          <chakra.p
            mt={2}
            color="gray.600"
            _dark={{
              color: "gray.300",
            }}
            noOfLines={4}
          >
            {description}
          </chakra.p>
        </Box>

        <Flex justifyContent="space-between" alignItems="center" mt={2}>
          <Button
            color="brand.600"
            _dark={{
              color: "brand.400",
            }}
            _hover={{
              textDecor: "underline",
            }}
            onClick={() => setActiveNewsId(_id)}
          >
            Read more
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

const NewsContainer = () => {
  const toast = useToast();
  const [news, setNews] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [activeNewsId, setActiveNewsId] = React.useState(null);

  const activeNews = useMemo(() => {
    if (!activeNewsId) return news?.at(-1);
    return news.find((n) => n._id === activeNewsId);
  }, [news, activeNewsId]);

  const marketNews = useMemo(() => {
    return news.filter((news) => news.category === "Market News");
  }, [news]);

  const announcementNews = useMemo(() => {
    return news.filter((news) => news.category === "Important Announcement");
  }, [news]);

  const handleGetAllNews = async () => {
    try {
      setLoading(true);
      const { data } = await getAllNews();
      setLoading(false);
      if (data.error)
        return toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      setNews(data.data);
    } catch (e) {
      setLoading(false);
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
  useEffect(() => {
    handleGetAllNews();
  }, []);
  if (loading)
    return (
      <Box>
        <Loader />
      </Box>
    );
  return (
    <SimpleGrid columns={[1, 1, 3]} spacing={3} px={4}>
      <GridItem colSpan={[1, 1, 2]}>
        <News news={activeNews} />
      </GridItem>
      <GridItem colSpan={[1, 1, 1]}>
        <Flex>
          <Tabs>
            <TabList>
              <Tab>Market News</Tab>
              <Tab>Important Announcement</Tab>
            </TabList>

            <TabPanels maxH="100vh" overflowY="auto" mx={4}>
              <TabPanel>
                {marketNews?.map((item, index) => (
                  <div key={item._id}>
                    <SingleNews data={item} setActiveNewsId={setActiveNewsId} />
                    <Divider my={2} />
                  </div>
                ))}
              </TabPanel>
              <TabPanel>
                {announcementNews?.map((item, index) => (
                  <div key={index}>
                    <SingleNews data={item} setActiveNewsId={setActiveNewsId} />
                    <Divider my={2} />
                  </div>
                ))}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </GridItem>
    </SimpleGrid>
  );
};

export default NewsContainer;
