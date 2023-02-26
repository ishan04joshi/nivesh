import { AiFillGift, AiFillProfile } from "react-icons/ai";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Stack,
  StackDivider,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useTheme,
  useToast,
} from "@chakra-ui/react";
import { BsCartCheckFill, BsFillPeopleFill, BsGearFill } from "react-icons/bs";
import { ChevronLeftIcon, CloseIcon } from "@chakra-ui/icons";
import {
  FaBell,
  FaClipboardCheck,
  FaMoon,
  FaRss,
  FaRssSquare,
  FaSun,
} from "react-icons/fa";
import { FiMenu, FiSearch } from "react-icons/fi";
import {
  HiCheckCircle,
  HiCode,
  HiCollection,
  HiCurrencyDollar,
  HiExclamationCircle,
  HiOutlineBell,
} from "react-icons/hi";
import {
  MdContactSupport,
  MdHome,
  MdKeyboardArrowRight,
  MdLogout,
  MdRealEstateAgent,
  MdUnsubscribe,
} from "react-icons/md";
import React, { useEffect, useState } from "react";
import { RiFundsBoxFill, RiProfileFill } from "react-icons/ri";
import {
  baseurl,
  clearAllNotifications,
  clearNotification,
  getNotifications,
  logout,
} from "../api/apis";

import { BiPackage } from "react-icons/bi";
import { IoIosPeople } from "react-icons/io";
import { Outlet } from "react-router-dom";
import Unverified from "./Unverified";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import useStore from "../store/store";

export default function Swibc() {
  const theme = useTheme();
  const { user } = useStore();
  const toast = useToast();
  const text = useColorModeValue("dark", "light");
  const { toggleColorMode: toggleMode } = useColorMode();
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  const navigate = useNavigate();
  const sidebar = useDisclosure();
  const integrations = useDisclosure();
  const users = useDisclosure();
  const color = useColorModeValue("gray.600", "gray.300");
  const [notifications, setNotifications] = useState([]);
  // useEffect(() => {
  //   if (!user) return navigate("/signin");
  // }, []);
  const handleDiscardAllNotifications = async () => {
    try {
      const { data } = await clearAllNotifications();
      if (data.status) {
        setNotifications([]);
      } else {
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleClearNotification = async (id) => {
    try {
      const { data } = await clearNotification(id);
      if (data.status) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      } else {
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleGetNotifications = async () => {
    try {
      const { data } = await getNotifications();
      if (data.status) {
        // console.log(data);
        if (JSON.stringify(notifications) !== JSON.stringify(data.data)) {
          setNotifications(data.data);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleLogout = async () => {
    try {
      const { data } = await logout();
      if (data?.status) return navigate("/signin");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || e?.message || "An error occurred!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  const NavItem = (props) => {
    const { icon, children, ...rest } = props;
    return (
      <Flex
        align="center"
        px="4"
        pl="4"
        py="3"
        cursor="pointer"
        color={useColorModeValue("inherit", "gray.400")}
        _hover={{
          bg: useColorModeValue("gray.100", "gray.900"),
          color: useColorModeValue("gray.900", "gray.200"),
        }}
        role="group"
        fontWeight="semibold"
        transition=".15s ease"
        {...rest}
      >
        {icon && (
          <Icon
            mx="2"
            boxSize="4"
            _groupHover={{
              color: color,
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    );
  };

  const SidebarContent = (props) => (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg={useColorModeValue("blue.600", "gray.800")}
      borderColor={useColorModeValue("inherit", "gray.700")}
      borderRightWidth="1px"
      w="60"
      display="flex"
      flexDirection={"column"}
      justifyContent={"space-between"}
      {...props}
    >
      <Stack spacing={1}>
        <Flex px="4" py="5" align="center">
          {/* <Logo /> */}
          <Stack direction="column" spacing={1}>
            <Heading
              fontSize="2xl"
              // ml="2"
              color="white"
              fontWeight="semibold"
            >
              niveshkro.com
            </Heading>
            <Text
              fontSize="sm"
              // ml="2"
              color="gray.400"
            >
              {user?.isAdmin
                ? "Administrative Dashboard"
                : "Personal Dashboard"}
            </Text>
          </Stack>
        </Flex>
        <Flex
          direction="column"
          as="nav"
          fontSize="sm"
          color="gray.600"
          aria-label="Main Navigation"
        >
          {user?.status === "pending" ? (
            <NavItem
              icon={HiCollection}
              onClick={() => navigate("/profile")}
              color={useColorModeValue("gray.100", "gray.300")}
            >
              Profile
            </NavItem>
          ) : (
            <>
              <NavItem
                icon={MdHome}
                color={useColorModeValue("gray.100", "gray.300")}
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </NavItem>
              <NavItem
                icon={HiCurrencyDollar}
                onClick={() => navigate("/withdrawals")}
                color={useColorModeValue("gray.100", "gray.300")}
              >
                Withdrawal Requests
              </NavItem>
              <NavItem
                icon={MdRealEstateAgent}
                onClick={() => navigate("/statements")}
                color={useColorModeValue("gray.100", "gray.300")}
              >
                Account Statements
              </NavItem>
              {user?.isAdmin && (
                <>
                  <NavItem
                    icon={BsFillPeopleFill}
                    onClick={() => navigate("/users")}
                    color={useColorModeValue("gray.100", "gray.300")}
                  >
                    User Management
                  </NavItem>
                  <NavItem
                    icon={FaRssSquare}
                    onClick={() => navigate("/newsletter")}
                    color={useColorModeValue("gray.100", "gray.300")}
                  >
                    News Letter
                  </NavItem>
                  <NavItem
                    icon={BsFillPeopleFill}
                    onClick={() => navigate("/subscribers")}
                    color={useColorModeValue("gray.100", "gray.300")}
                  >
                    Subscribers
                  </NavItem>
                  <NavItem
                    icon={BsFillPeopleFill}
                    onClick={() => navigate("/market-values")}
                    color={useColorModeValue("gray.100", "gray.300")}
                  >
                    Market Values
                  </NavItem>
                  <NavItem
                    icon={IoIosPeople}
                    onClick={() => navigate("/pending/registrations")}
                    color={useColorModeValue("gray.100", "gray.300")}
                  >
                    Pending Registrations
                  </NavItem>
                  <NavItem
                    icon={RiFundsBoxFill}
                    onClick={() => navigate("/funds/manager")}
                    color={useColorModeValue("gray.100", "gray.300")}
                  >
                    Create or Update Funds
                  </NavItem>
                  <NavItem
                    icon={BsCartCheckFill}
                    onClick={() => navigate("/orders")}
                    color={useColorModeValue("gray.100", "gray.300")}
                  >
                    Orders
                  </NavItem>

                  <NavItem
                    icon={FaRssSquare}
                    onClick={() => navigate("/news")}
                    color={useColorModeValue("gray.100", "gray.300")}
                  >
                    News Management
                  </NavItem>
                  <NavItem
                    icon={MdContactSupport}
                    onClick={() => navigate("/support")}
                    color={useColorModeValue("gray.100", "gray.300")}
                  >
                    Support Requests
                  </NavItem>
                </>
              )}
              <NavItem
                icon={BiPackage}
                onClick={() => navigate("/funds")}
                color={useColorModeValue("gray.100", "gray.300")}
              >
                Explore Funds
              </NavItem>
              <NavItem
                icon={MdUnsubscribe}
                onClick={() => navigate("/subscription")}
                color={useColorModeValue("gray.100", "gray.300")}
              >
                My Subscription
              </NavItem>
              <NavItem
                icon={RiProfileFill}
                onClick={() => navigate("/profile")}
                color={useColorModeValue("gray.100", "gray.300")}
              >
                Profile
              </NavItem>
              <NavItem
                icon={AiFillProfile}
                color={useColorModeValue("gray.100", "gray.300")}
              >
                Changelog
              </NavItem>
              {}
            </>
          )}
        </Flex>
      </Stack>
      <Stack spacing={1} pt={5}>
        <Button
          variant="outline"
          w="fit-content"
          alignSelf="center"
          rightIcon={<MdLogout />}
          color="white"
          _hover={{
            color: "blue.900",
            bg: "red.500",
          }}
          onClick={handleLogout}
        >
          Sign Out
        </Button>
      </Stack>
    </Box>
  );

  useEffect(() => {
    handleGetNotifications();
    const abortController = new AbortController();
    const interval = setInterval(() => {
      handleGetNotifications();
    }, 10000);
    return () => {
      clearInterval(interval);
      abortController.abort();
    };
  }, []);

  return (
    <Box
      as="section"
      bg={useColorModeValue("blue.50", "gray.700")}
      minH="100vh"
    >
      <SidebarContent display={{ base: "none", md: "unset" }} />
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          px="4"
          bg={useColorModeValue("white", "gray.800")}
          borderBottomWidth="1px"
          borderColor={useColorModeValue("inherit", "gray.700")}
          h="14"
        >
          <Stack direction="row" spacing={2}>
            <IconButton
              aria-label="Menu"
              display={{ base: "inline-flex", md: "none" }}
              onClick={sidebar.onOpen}
              icon={<FiMenu />}
              size="sm"
            />

            <IconButton
              aria-label="Go Back"
              onClick={() => navigate(-1)}
              icon={<ChevronLeftIcon />}
              size="sm"
              sx={{ alignSelf: "center" }}
            />
            {}
          </Stack>

          <Flex align="center" gap="1">
            <Avatar
              ml="4"
              size="sm"
              name="anubra266"
              src={`${baseurl}/assets/${user?._id}/${user?.avatar}`}
              cursor="pointer"
            />
            <Popover
              placement="bottom"
              closeOnBlur={true}
              _focus={{
                border: "none",
              }}
            >
              <PopoverTrigger
                _focus={{
                  border: "none",
                }}
              >
                <IconButton
                  _focus={{
                    border: "none",
                  }}
                  aria-label="Notifications"
                  variant="ghost"
                  icon={<HiOutlineBell />}
                />
              </PopoverTrigger>

              <PopoverContent
                _focus={{
                  border: "none",
                }}
                boxShadow="md"
                sx={{
                  marginRight: 1,
                }}
                maxH={["400px", "400px", "400px"]}
              >
                <PopoverHeader pt={4} pb={2} fontWeight="bold" border="0">
                  <Stack direction="row" justifyContent="space-between">
                    <Text alignSelf="center">Notifications</Text>
                  </Stack>
                </PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody overflow="hidden" overflowY="auto" h="100%">
                  <Stack spacing={3}>
                    <Stack
                      divider={<StackDivider />}
                      justifyContent={"space-between"}
                      cursor="pointer"
                      px={1}
                      py={1}
                      borderRadius="md"
                    >
                      {notifications?.map((item, index) => (
                        <Stack
                          direction="row"
                          justifyContent={"space-between"}
                          spacing={3}
                        >
                          <Stack spacing={3} direction="row">
                            <HiExclamationCircle
                              fill={theme.colors.pink}
                              style={{
                                alignSelf: "center",
                              }}
                            />
                            <Stack spacing={1}>
                              <Stack spacing={0}>
                                <Text
                                  noOfLines={1}
                                  fontSize="sm"
                                  fontWeight={700}
                                >
                                  {item.title}
                                </Text>
                                <Text
                                  noOfLines={2}
                                  fontSize="xs"
                                  fontWeight={400}
                                >
                                  {item?.message}
                                </Text>
                              </Stack>

                              <Text
                                color="gray.500"
                                fontSize="xs"
                                fontWeight={500}
                              >
                                {dayjs(item?.date).format(
                                  "MMMM D, YYYY [at] h:mm A"
                                )}
                              </Text>
                            </Stack>
                          </Stack>
                          <IconButton
                            alignSelf="center"
                            variant="ghost"
                            size="sm"
                            icon={<CloseIcon />}
                            aria-label="Delete"
                            onClick={() => {
                              handleClearNotification(item._id);
                            }}
                          />
                        </Stack>
                      ))}
                      {notifications?.length === 0 && <Spinner />}
                    </Stack>
                  </Stack>
                </PopoverBody>
                <PopoverFooter
                  border="0"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  pb={4}
                >
                  <Button
                    as="div"
                    variant="ghost"
                    p={0}
                    size={"sm"}
                    sx={{
                      "&:hover": {
                        transform: "scale(1)",
                        backgroundColor: "transparent",
                      },
                    }}
                    borderRadius="50%"
                    border="1px"
                  >
                    {notifications?.length}
                  </Button>
                  <ButtonGroup size="sm">
                    <Button
                      colorScheme="green"
                      onClick={handleDiscardAllNotifications}
                    >
                      Clear All
                    </Button>
                  </ButtonGroup>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
            {}
          </Flex>
        </Flex>

        <Box as="main" p="1">
          {/* Add content here, remove div below  */}
          <Box
            rounded="md"
            p="2"
          >
            {
            /* 
            {!user?.verified && <Unverified />}
             */
             }
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
