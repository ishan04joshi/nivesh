import {
  Box,
  Button,
  Flex,
  GridItem,
  Heading,
  Icon,
  Input,
  Link,
  SimpleGrid,
  Stack,
  Text,
  VisuallyHidden,
  chakra,
  useColorModeValue,
} from "@chakra-ui/react";

import React from "react";
import { motion } from "framer-motion";
import { pageTransitions } from "../utils/pageTransitions";

const MotionBox = motion(Box);
const KuttyHero = () => {
  const Feature = (props) => (
    <Flex alignItems="center" color={useColorModeValue(null, "white")}>
      <Icon boxSize={4} mr={1} color="green.600" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        ></path>
      </Icon>
      {props.children}
    </Flex>
  );
  return (
    <MotionBox px={4} py={32} mx="auto" variants={pageTransitions} initial="initial" animate="animate" exit="exit">
      <Box w={{ base: "full", md: 11 / 12, xl: 8 / 12 }} textAlign={{ base: "left", md: "center" }} mx="auto">
        <Heading
          mb={3}
          fontSize={{ base: "4xl", md: "5xl" }}
          fontWeight={{ base: "bold", md: "extrabold" }}
          color={useColorModeValue("gray.900", "gray.100")}
          lineHeight="shorter"
        >
          Privacy Policy
        </Heading>
        <Text mb={6} fontSize={{ base: "lg", md: "xl" }} color="gray.500" lineHeight="base">
          We’re on a mission to bring transparency to finance. We charge as little as possible, and we always show you upfront. No hidden fees. No bad
          exchange rates. No surprises.
        </Text>
        <Stack
          display="flex"
          direction={{ base: "column", md: "row" }}
          justifyContent={{ base: "start", md: "center" }}
          mb={3}
          spacing={{ base: 2, md: 8 }}
          fontSize="xs"
          color="gray.600"
        >
          <Feature>100% Secure</Feature>
          <Feature>SIP Available</Feature>
          {/* <Feature></Feature> */}
        </Stack>
        <Stack spacing={6} textAlign="left" mt={16}>
          <Text fontSize="sm" color="gray.500" lineHeight="base">
            niveshkro.com is owned by R2I business process services private limited (hereinafter referred to as R2I). R2I is committed to protect the
            data, information or documents submitted to us on our website/app or the service made available through the website or application of R2I.
          </Text>
          <Stack spacing={2}>
            <Heading fontSize="md" fontWeight={700}>
              Consent &amp; Agreement between R2I and User
            </Heading>
            <Text fontSize="sm" color="gray.500" lineHeight="base">
              By submitting your personal information, data or documents to us, you agree to the terms of this Privacy Policy and give consent to use
              the information, data or documents to the below Privacy Policy.
            </Text>
          </Stack>
          <Stack spacing={2} pl={2}>
            <Heading fontSize="md" fontWeight={700}>
              What do we do with your information?
            </Heading>
            <Stack spacing={2}>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                When you use or take any services from the website/app, as part of the buying and selling process, we collect the personal information
                and documents you give us such as your name, address, email address, mobile number.
              </Text>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                When you browse our services, we also automatically receive your computer’s internet protocol (IP) address in order to provide us with
                information that helps us learn about your browser and operating system.
              </Text>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                Email marketing (if applicable): With your permission, we may send you emails about our services, new products and other updates.
              </Text>
            </Stack>
          </Stack>
          <Stack spacing={2} pl={2}>
            <Heading fontSize="md" fontWeight={700}>
              Consent
            </Heading>
          </Stack>
          <Stack spacing={2} pl={2}>
            <Heading fontSize="md" fontWeight={700}>
              How do I withdraw my consent?
            </Heading>
            <Stack spacing={2}>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                If after you opt-in, you change your mind, you may withdraw your consent for us to contact you, for the continued collection, use or
                disclosure of your information, at anytime, by contacting us at help@niveshkro.com or mailing us at: FF-10, 1ST FLOOR, SS OMNIA MALL,
                SEC-86, GURGAON, HARYANA-122004.
              </Text>
            </Stack>
          </Stack>
          <Stack spacing={2} pl={2}>
            <Heading fontSize="md" fontWeight={700}>
              How do you get my consent?
            </Heading>
            <Stack spacing={2}>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                When you provide us with personal information to complete a transaction, verify your credit card, place an order, we imply that you
                consent to our collecting it and using it for that specific reason only.
              </Text>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                If we ask for your personal information for a secondary reason, like marketing, we will either ask you directly for your expressed
                consent, or provide you with an opportunity to say no.
              </Text>
            </Stack>
          </Stack>
          <Stack spacing={2} pl={2}>
            <Heading fontSize="md" fontWeight={700}>
              Disclosure
            </Heading>
            <Stack spacing={2}>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service.
              </Text>
            </Stack>
          </Stack>
          <Stack spacing={2} pl={2}>
            <Heading fontSize="md" fontWeight={700}>
              Payment
            </Heading>
            <Stack spacing={2}>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                We use Razorpay for processing payments. We/Razorpay do not store your card data on their servers. The data is encrypted through the
                Payment Card Industry Data Security Standard (PCI-DSS) when processing payment. Your purchase transaction data is only used as long as
                is necessary to complete your purchase transaction. After that is complete, your purchase transaction information is not saved.
              </Text>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                Our payment gateway adheres to the standards set by PCI-DSS as managed by the PCI Security Standards Council, which is a joint effort
                of brands like Visa, MasterCard, American Express and Discover.
              </Text>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                PCI-DSS requirements help ensure the secure handling of credit card information by our store and its service providers.
              </Text>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                For more insight, you may also want to read terms and conditions of razorpay on{" "}
                <Link href={"https://razorpay.com"}>https://razorpay.com</Link>
              </Text>
            </Stack>
          </Stack>
          <Stack spacing={2} pl={2}>
            <Heading fontSize="md" fontWeight={700}>
              Third-party services
            </Heading>
            <Stack spacing={2}>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                In general, the third-party providers used by us will only collect, use and disclose your information to the extent necessary to allow
                them to perform the services they provide to us. However, certain third-party service providers, such as payment gateways and other
                payment transaction processors, have their own privacy policies in respect to the information we are required to provide to them for
                your purchase-related transactions. For these providers, we recommend that you read their privacy policies so you can understand the
                manner in which your personal information will be handled by these providers.
              </Text>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                In particular, remember that certain providers may be located in or have facilities that are located a different jurisdiction than
                either you or us. So if you elect to proceed with a transaction that involves the services of a third-party service provider, then
                your information may become subject to the laws of the jurisdiction(s) in which that service provider or its facilities are located.
              </Text>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                Once you leave our website or are redirected to a third-party website or application, you are no longer governed by this Privacy
                Policy or our website’s Terms of Service.
              </Text>
            </Stack>
          </Stack>
          <Stack spacing={2} pl={2}>
            <Heading fontSize="md" fontWeight={700}>
              Links
            </Heading>
            <Stack spacing={2}>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                When you click on links on our website, they may direct you away from our site. We are not responsible for the privacy practices of
                other sites and encourage you to read their privacy statements.
              </Text>
            </Stack>
          </Stack>
          <Stack spacing={2} pl={2}>
            <Heading fontSize="md" fontWeight={700}>
              Security
            </Heading>
            <Stack spacing={2}>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not
                inappropriately lost, misused, accessed, disclosed, altered or destroyed.
              </Text>
            </Stack>
          </Stack>
          <Stack spacing={2} pl={2}>
            <Heading fontSize="md" fontWeight={700}>
              Cookies
            </Heading>
            <Stack spacing={2}>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                We use cookies to maintain session of your user. It is not used to personally identify you on other websites.
              </Text>
            </Stack>
          </Stack>
          <Stack spacing={2} pl={2}>
            <Heading fontSize="md" fontWeight={700}>
              Age of Consent
            </Heading>
            <Stack spacing={2}>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                By using this site, you represent that you are at least the age of majority in your state or province of residence, or that you are
                the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to
                use this site.
              </Text>
            </Stack>
          </Stack>
          <Stack spacing={2} pl={2}>
            <Heading fontSize="md" fontWeight={700}>
              Changes to this Privacy Policy
            </Heading>
            <Stack spacing={2}>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications will take
                effect immediately upon their posting on the website. If we make material changes to this policy, we will notify you here that it has
                been updated, so that you are aware of what information we collect, how we use it, and under what circumstances, if any, we use and/or
                disclose it.
              </Text>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                If our store is acquired or merged with another company, your information may be transferred to the new owners so that we may continue
                to sell products to you.
              </Text>
            </Stack>
          </Stack>
          <Stack spacing={2} pl={2}>
            <Heading fontSize="md" fontWeight={700}>
              Questions and Contact information
            </Heading>
            <Stack spacing={2}>
              <Text fontSize="sm" color="gray.500" lineHeight="base">
                If you would like to: access, correct, amend or delete any personal information we have about you, register a complaint, or simply
                want more information contact our Privacy Compliance Officer at help@niveshkro.com or by mail at: FF-10, 1ST FLOOR, SS OMNIA MALL,
                SEC-86, GURGAON, HARYANA-122004. Re: Privacy Compliance Officer. Address: FF-10, 1ST FLOOR, SS OMNIA MALL, SEC-86, GURGAON, HARYANA-
                122004.
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </MotionBox>
  );
};

export default KuttyHero;
