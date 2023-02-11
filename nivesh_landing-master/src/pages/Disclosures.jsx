import {
  Box,
  Button,
  Flex,
  GridItem,
  Heading,
  Icon,
  Input,
  Link,
  List,
  ListItem,
  OrderedList,
  SimpleGrid,
  Stack,
  Text,
  UnorderedList,
  VisuallyHidden,
  chakra,
  useColorModeValue,
} from "@chakra-ui/react";

import React from "react";

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
    <Box px={4} py={32} mx="auto">
      <Box w={{ base: "full", md: 11 / 12, xl: 8 / 12 }} textAlign={{ base: "left", md: "center" }} mx="auto">
        <Heading
          mb={3}
          fontSize={{ base: "4xl", md: "5xl" }}
          fontWeight={{ base: "bold", md: "extrabold" }}
          color={useColorModeValue("gray.900", "gray.100")}
          lineHeight="shorter"
        >
          Disclosures
        </Heading>

        <Stack spacing={6} textAlign="left" mt={16}>
          <OrderedList color="gray.600" spacing={4}>
            <ListItem>
              R2I Business Process Services Private Limited (hereinafter referred to as “the Company”) is a financial
              technology company based in Gurgaon since 2021. The company builds technology platforms, investment
              products and provide taxation and compliance services for retail investors.
            </ListItem>
            <ListItem>
              niveshkro provides predefined portfolio of stocks/ETFs curated to track a particular objective or a
              strategy. With niveshkro, you can build a diversified & long-term portfolio.
            </ListItem>
            <ListItem>
              To enable transactions in niveshkro, the company create portfolios based on customers’ requirements and
              manage the fund to give better returns. Our professionals do deep integration with the Company, to power
              transactions in a secured and compliant manner.
            </ListItem>
            <ListItem>
              R2I Business Process Services Private Limited (hereinafter referred to as “the Company”) is a financial
              technology company based in Gurgaon since 2021. The company builds technology platforms, investment
              products and provide taxation and compliance services for retail investors.
            </ListItem>
            <ListItem>
              Unless otherwise stated, the percentage returns displayed on the website for comparing fund performance
              with any benchmark are Absolute Returns.
            </ListItem>
            <ListItem>
              The content and data available on niveshkro.com, including but not limited to fund return numbers and fund
              rationale are for information and illustration purposes only.
            </ListItem>
            <ListItem>
              <Stack spacing={3}>
                <Text>
                  Charts and performance numbers might include backtested/simulated results calculated via a standard
                  methodology and do not include the impact of transaction fee and other related costs. Data used for
                  calculation of historical returns and other information is provided by exchange approved third party
                  data vendors and has neither been audited nor validated by the Company.
                  <br />
                  "Back-testing" is the application of a quantitative model to historical market data to generate
                  hypothetical performance during a prior period. Use of back-tested data has inherent limitations
                  including the following:
                </Text>
                <UnorderedList color="gray.600" pl={4}>
                  <ListItem>
                    The results do not reflect the results of actual trading or the effect of material economic and
                    market conditions on the decision-making process, but were achieved by means of retrospective
                    application, which may have been designed with the benefit of hindsight.
                  </ListItem>{" "}
                  <ListItem>
                    Calculation of such back-tested performance data is based on assumptions integral to the model which
                    may or may not be testable and are therefore subject to losses.
                  </ListItem>
                  <ListItem>
                    Actual performance may differ significantly from back-tested performance. Back-tested results are
                    not adjusted to reflect the reinvestment of dividends and other income and, except where otherwise
                    indicated, do not include the effect of back-tested transaction costs.
                  </ListItem>
                  <ListItem>
                    Back-tested returns do not represent actual returns and should not be interpreted as an indication
                    of such.
                  </ListItem>
                </UnorderedList>
              </Stack>
            </ListItem>
            <ListItem>
              Niveshkro funds are not to be construed as a product based on or linked to an index developed by the NSE
              Indices as the Company is not in the index manufacturing business and ‘niveshkro funds’ is not an
              independent index. Having said this, the Company is not restricted in comparing the performances of the
              funds with any other index.
            </ListItem>
            <ListItem>niveshkro are not licensed to any exchange, trading or settling venue outside India.</ListItem>
            <ListItem>
              Prices shown on the niveshkro.com are updated on the basis of closing prices of stocks on daily basis The
              updated prices on the niveshkro.com are daily updated after 9:00pm of the day market opens.
            </ListItem>
            <ListItem>
              All information present on niveshkro.com is to help investors in their decision-making process and shall
              not be considered as a recommendation or solicitation of an investment or investment strategy. Investors
              are responsible for their investment decisions and are responsible to validate all the information used to
              make the investment decision. Investor should understand that his/her investment decision is based on
              personal investment needs and risk tolerance, and performance information available on niveshkro.com is
              one amongst many other things that should be considered while making an investment decision. Past
              performance does not guarantee future returns and performance of funds are subject to market risk.
              Investments in the securities market are subject to market risks and investors should read all the related
              documents carefully before investing.
            </ListItem>
            <ListItem>
              Registered office of R2I Business Process Services Private Limited - FF-10, 1st Floor, SS Omnia Mall,
              Sector-86, Gurgaon, Haryana–122004. Website – <Link href="www.niveshkro.com">www.niveshkro.com</Link>
            </ListItem>
            <ListItem>CIN: U74999HR2021PTC097469</ListItem>
            <ListItem>Support - Contact us on help@niveshkro.com for any queries and assistance</ListItem>
            <ListItem>
              All grievances should be addressed to our grievance officer Mr Ankit Kumar using help@niveshkro.com.
            </ListItem>
          </OrderedList>
        </Stack>
      </Box>
    </Box>
  );
};

export default KuttyHero;
