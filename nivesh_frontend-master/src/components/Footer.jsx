import {
  Box,
  Button,
  Divider,
  Flex,
  GridItem,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  SimpleGrid,
  Stack,
  StackDivider,
  Text,
  useToast,
} from "@chakra-ui/react";
import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

import { websiteURL } from "../env";

export default function Footer() {
  return (
    <SimpleGrid
      px={[6, 6, 12]}
      spacing={16}
      columns={[1, 1, 4]}
      bgColor="white"
      boxShadow="lg"
      color="gray.600"
      // bgGradient="linear(to-r, gray.600, gray.500, gray.400)"
      py={8}
    >
      <GridItem colSpan={[1, 1, 2]}>
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Heading>niveshkro</Heading>
            <Text pt={2} fontSize="sm">
              niveshkro is a market based investment platform, mainly focus on
              Indian equities and funds. Funds are the combination of equities,
              ETF (Exchange traded funds) & bonds.
            </Text>
          </Stack>
          <Text pt={3} fontSize="xx-small">
            Investing in Stocks/ETFs (Exchange Traded Funds) are subject to
            market risks. Read all the related documents before investing.
            Investors should consider all risk factors and consult their
            financial advisor before investing.
          </Text>
          <Text mt={6} fontWeight={700}>
            niveshkro subscription- Market insights
          </Text>
        </Stack>
      </GridItem>
      <GridItem
        colSpan={1}
        display="flex"
        flexDirection={"column"}
        alignItems={"center"}
      >
        <Stack
          spacing={3}
          w="100%"
          justifyContent={["flex-start", "flex-start", "center"]}
          pl={[0, 0, 12]}
          direction="row"
          //   flexWrap={"wrap"}
        >
          {/* LINKS */}
          <Stack spacing={3}>
            <Stack spacing={3} direction="row">
              <Stack spacing={1}>
                <Heading mb={2} fontSize="md">
                  Company
                </Heading>
                <Stack spacing={0} fontSize="xs">
                  <Link href={websiteURL + "/about"}>About Us</Link>
                  <Link href={websiteURL + "/news"}>News</Link>
                  <Link href={websiteURL + "/contact"}>Help & Support</Link>
                </Stack>
              </Stack>
              <Stack spacing={1}>
                <Heading mb={2} fontSize="md">
                  Term of Use
                </Heading>
                <Stack spacing={0} fontSize="xs">
                  <Link href={websiteURL + "/disclosures"}>Disclosures</Link>
                  <Link href={websiteURL + "/privacy"}>Privacy Policy</Link>
                </Stack>
              </Stack>
            </Stack>
            <Stack spacing={1}>
              <Heading fontSize="sm" fontWeight={700}>
                R2I business process services private limited
              </Heading>
              <Text fontSize="xs" fontWeight={300}>
                FF-10, 1st floor, SS Omnia mall, Sec-86, Gurgaon,
                Haryana-122004. India.
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </GridItem>
      <GridItem>
        <Stack spacing={3} pl={[0, 0, 12]}>
          <Stack spacing={3} direction="row">
            <EmailIcon color="gray.700" alignSelf="center" />
            <Link
              textDecor="underline"
              style={{
                textDecoration: "underline",
              }}
              href="mailto:help@niveshkro.com"
              _focus={{
                border: "none",
              }}
            >
              help@niveshkro.com
            </Link>
          </Stack>
          <Stack spacing={0} direction="row">
            <IconButton
              variant="ghost"
              aria-label="twitter"
              colorScheme="twitter"
              icon={<FaTwitter />}
              _hover={{
                bg: "transparent",
              }}
              onClick={() => window.open("https://twitter.com/niveshkro")}
            />
            <IconButton
              variant="ghost"
              aria-label="facebook"
              colorScheme="facebook"
              icon={<FaFacebook />}
              _hover={{
                bg: "transparent",
              }}
              onClick={() =>
                window.open(
                  "https://www.facebook.com/profile.php?id=100088049628338"
                )
              }
            />
            <IconButton
              variant="ghost"
              aria-label="instagram"
              colorScheme="instagram"
              icon={<FaInstagram />}
              _hover={{
                bg: "transparent",
              }}
              onClick={() =>
                window.open("https://www.instagram.com/niveshkro/")
              }
            />
            <IconButton
              variant="ghost"
              aria-label="linkedin"
              colorScheme="linkedin"
              icon={<FaLinkedin />}
              _hover={{
                bg: "transparent",
              }}
              onClick={() =>
                window.open("https://www.linkedin.com/company/niveshkro/")
              }
            />
            <IconButton
              variant="ghost"
              aria-label="youtube"
              color="red.400"
              icon={<FaYoutube />}
              _hover={{
                bg: "transparent",
              }}
              onClick={() =>
                window.open(
                  "https://www.youtube.com/channel/UCwIemLiRBJ7GtUA_ixIUing"
                )
              }
            />
            <IconButton
              variant="ghost"
              aria-label="whatsapp"
              colorScheme="whatsapp"
              icon={<FaWhatsapp />}
              _hover={{
                bg: "transparent",
              }}
              onClick={(e) => {
                window.open("www.whatsapp.com");
                e.preventDefault();
              }}
            />
          </Stack>
        </Stack>
      </GridItem>
    </SimpleGrid>
  );
}
