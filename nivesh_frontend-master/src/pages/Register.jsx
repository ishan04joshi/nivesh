import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  GridItem,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Stack,
  Text,
  chakra,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { baseurl, updateUserProfile, url } from "../api/apis";

import ChangeWProfile from "../components/ChangeWProfile";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useStore from "../store/store";

const relations = [
  {
    value: "Father",
    option: "Father",
  },
  {
    value: "Mother",
    option: "Mother",
  },
  {
    value: "Spouse",
    option: "Spouse",
  },
  {
    value: "Brother",
    option: "Brother",
  },
  {
    value: "Sister",
    option: "Sister",
  },
  {
    value: "Other",
    option: "Other",
  },
];
export default function Component() {
  const toast = useToast();
  const navigate = useNavigate();
  const { email, phone, setUser, user } = useStore();
  const [avatar, setAvatar] = useState(null);
  const [avatarUri, setAvatarUri] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountNo, setBankAccountNo] = useState("");
  const [bankAccountType, setBankAccountType] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [aadharFile, setAadharFile] = useState(null);
  const [pan, setPan] = useState("");
  const [panFile, setPanFile] = useState(null);
  const [bankDocument, setBankDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = React.useRef();
  const panRef = React.useRef();
  const aadharRef = React.useRef();
  const bankDocumentRef = React.useRef();
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeDOB, setNomineeDOB] = useState("");
  const [nomineeRelation, setNomineeRelation] = useState("");

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setCountry(user.country || "india");
    setBankName(user.bankAccount?.name || "");
    setBankAccountNo(user.bankAccount?.accountNo || "");
    setBankAccountType(user.bankAccount?.type || null);
    setBankIfsc(user.bankAccount?.ifsc || "");
    setBankBranch(user.bankAccount?.branch || "");
    setState(user.state || "");
    setCity(user.city || "");
    setZip(user.zip || "");
    setAddress(user.address || "");
    setAadhar(user.aadhar?.id || "");
    setPan(user.pan?.id || "");
    setNomineeName(user.nominee?.name || "");
    setNomineeDOB(user.nominee?.dob || "");
    setNomineeRelation(user.nominee?.relationship || "");
  }, [user]);

  const handleUpdateNewUser = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("country", country);
      formData.append("bankName", bankName);
      formData.append("bankAccountNo", bankAccountNo);
      formData.append("bankAccountType", bankAccountType);
      formData.append("bankIfsc", bankIfsc);
      formData.append("bankBranch", bankBranch);
      formData.append("state", state);
      formData.append("city", city);
      formData.append("zip", zip);
      formData.append("address", address);
      formData.append("aadhar", aadhar);
      formData.append("pan", pan);
      aadharFile && formData.append("aadharFile", aadharFile);
      panFile && formData.append("panFile", panFile);
      bankDocument && formData.append("bankDocument", bankDocument);
      avatar && formData.append("avatar", avatar);
      formData.append("nomineeName", nomineeName);
      formData.append("nomineeDOB", nomineeDOB);
      formData.append("nomineeRelation", nomineeRelation);
      const { data } = await updateUserProfile(formData);
      if (data.status) {
        setLoading(false);
        setUser(data.data);
        toast({
          title: "Success",
          description: "User Updated successfully & sent for verification",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "bottom-right",
        });
        // navigate("/success/pending");
      }
      if (!data.status) {
        setLoading(false);
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  return (
    <Box bg={useColorModeValue("gray.50", "inherit")} p={5}>
      <Box>
        <SimpleGrid
          display={{ base: "initial", md: "grid" }}
          columns={{ md: 3 }}
          spacing={{ md: 6 }}
        >
          <GridItem colSpan={{ md: 1 }}>
            <Box px={[4, 0]}>
              <Heading fontSize="lg" fontWeight="md" lineHeight="6">
                Profile
              </Heading>
              <Text
                mt={1}
                fontSize="sm"
                color={useColorModeValue("gray.600", "gray.400")}
              >
                This information will be displayed publicly so be careful what
                you share.
              </Text>
            </Box>
          </GridItem>
          <GridItem mt={[5, null, 0]} colSpan={{ md: 2 }}>
            <Stack
              px={4}
              py={5}
              bg={useColorModeValue("white", "gray.700")}
              spacing={6}
              p={{ sm: 6 }}
            >
              <Text
                fontSize="sm"
                fontWeight="md"
                color={useColorModeValue("gray.700", "gray.50")}
              >
                Photo
              </Text>
              <Stack direction="row" flexWrap="wrap" spacing={4}>
                <Avatar
                  boxSize={24}
                  bg={useColorModeValue("gray.100", "gray.800")}
                  icon={
                    <Icon
                      as={FaUser}
                      boxSize={20}
                      mt={3}
                      rounded="full"
                      color={useColorModeValue("gray.300", "gray.700")}
                    />
                  }
                  src={
                    avatarUri ||
                    `${baseurl}/assets/${user?._id}/${user?.avatar}`
                  }
                />

                <Input
                  type="file"
                  ref={inputRef}
                  // opacity="0"
                  display="none"
                  aria-hidden="true"
                  accept="image/*"
                  onChange={(e) => {
                    setAvatar(e.target.files[0]);
                    setAvatarUri(URL.createObjectURL(e.target.files[0]));
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  px={2}
                  onClick={() => inputRef.current.click()}
                  sx={{ alignSelf: "center" }}
                >
                  Choose
                </Button>

                <Text
                  fontSize="sm"
                  fontWeight="md"
                  color={useColorModeValue("gray.700", "gray.50")}
                  sx={{ alignSelf: "center" }}
                >
                  Attached: {avatar ? avatar.name : user?.avatar}
                </Text>
              </Stack>
            </Stack>
          </GridItem>
        </SimpleGrid>
      </Box>
      <Box visibility={{ base: "hidden", sm: "visible" }} aria-hidden="true">
        <Box py={5}>
          <Box
            borderTop="solid 1px"
            borderTopColor={useColorModeValue("gray.200", "whiteAlpha.200")}
          ></Box>
        </Box>
      </Box>

      <Box mt={[10, 0]}>
        <SimpleGrid
          display={{ base: "initial", md: "grid" }}
          columns={{ md: 3 }}
          spacing={{ md: 6 }}
        >
          <GridItem colSpan={{ md: 1 }}>
            <Box px={[4, 0]}>
              <Heading fontSize="lg" fontWeight="medium" lineHeight="6">
                Personal Information
              </Heading>
              <Text
                mt={1}
                fontSize="sm"
                color={useColorModeValue("gray.600", "gray.400")}
              >
                Use a permanent address where you can receive mail.
              </Text>
            </Box>
          </GridItem>
          <GridItem mt={[5, null, 0]} colSpan={{ md: 2 }}>
            <Stack
              px={4}
              py={5}
              p={[null, 6]}
              bg={useColorModeValue("white", "gray.700")}
              spacing={6}
            >
              <Stack direction="row" spacing={2} width="100%">
                <FormControl>
                  <FormLabel
                    htmlFor="email_address"
                    fontSize="sm"
                    fontWeight="md"
                    color={useColorModeValue("gray.700", "gray.50")}
                  >
                    Email address
                  </FormLabel>
                  <Input
                    type="text"
                    disabled={true}
                    mt={1}
                    focusBorderColor="brand.400"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    value={user?.email}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="md"
                    color={useColorModeValue("gray.700", "gray.50")}
                  >
                    Phone Number
                  </FormLabel>
                  <Input
                    disabled={true}
                    mt={1}
                    focusBorderColor="brand.400"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    value={user?.phone}
                  />
                </FormControl>
              </Stack>
              <SimpleGrid columns={6} spacing={6}>
                <FormControl as={GridItem} colSpan={[6, 3]}>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="md"
                    color={useColorModeValue("gray.700", "gray.50")}
                  >
                    First name
                  </FormLabel>
                  <Input
                    type="text"
                    mt={1}
                    focusBorderColor="brand.400"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                    defaultValue={user?.firstName}
                  />
                </FormControl>

                <FormControl as={GridItem} colSpan={[6, 3]}>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="md"
                    color={useColorModeValue("gray.700", "gray.50")}
                    onChange={(e) => setLastName(e.target.value)}
                  >
                    Last name
                  </FormLabel>
                  <Input
                    type="text"
                    name="last_name"
                    id="last_name"
                    autoComplete="family-name"
                    mt={1}
                    focusBorderColor="brand.400"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    value={lastName}
                    defaultValue={user?.lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </FormControl>

                <FormControl as={GridItem} colSpan={[6, 3]}>
                  <FormLabel
                    htmlFor="country"
                    fontSize="sm"
                    fontWeight="md"
                    color={useColorModeValue("gray.700", "gray.50")}
                  >
                    Country / Region
                  </FormLabel>
                  <Select
                    id="country"
                    name="country"
                    autoComplete="country"
                    placeholder="Select option"
                    mt={1}
                    focusBorderColor="brand.400"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option>India</option>
                  </Select>
                </FormControl>

                <FormControl as={GridItem} colSpan={6}>
                  <FormLabel
                    htmlFor="street_address"
                    fontSize="sm"
                    fontWeight="md"
                    color={useColorModeValue("gray.700", "gray.50")}
                  >
                    Street address
                  </FormLabel>
                  <Input
                    type="text"
                    name="street_address"
                    id="street_address"
                    autoComplete="street-address"
                    mt={1}
                    focusBorderColor="brand.400"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    value={address}
                    defaultValue={user?.address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </FormControl>

                <FormControl as={GridItem} colSpan={[6, 6, null, 2]}>
                  <FormLabel
                    htmlFor="city"
                    fontSize="sm"
                    fontWeight="md"
                    color={useColorModeValue("gray.700", "gray.50")}
                  >
                    City
                  </FormLabel>
                  <Input
                    type="text"
                    name="city"
                    id="city"
                    autoComplete="street-address"
                    mt={1}
                    focusBorderColor="brand.400"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                    defaultValue={user?.city}
                  />
                </FormControl>

                <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
                  <FormLabel
                    htmlFor="state"
                    fontSize="sm"
                    fontWeight="md"
                    color={useColorModeValue("gray.700", "gray.50")}
                  >
                    State / Province
                  </FormLabel>
                  <Input
                    type="text"
                    name="state"
                    id="state"
                    autoComplete="state"
                    mt={1}
                    focusBorderColor="brand.400"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    onChange={(e) => setState(e.target.value)}
                    value={state}
                    defaultValue={user?.state}
                  />
                </FormControl>

                <FormControl as={GridItem} colSpan={[6, 3, null, 2]}>
                  <FormLabel
                    htmlFor="postal_code"
                    fontSize="sm"
                    fontWeight="md"
                    color={useColorModeValue("gray.700", "gray.50")}
                  >
                    ZIP / Postal
                  </FormLabel>
                  <Input
                    type="text"
                    name="postal_code"
                    id="postal_code"
                    autoComplete="postal-code"
                    mt={1}
                    focusBorderColor="brand.400"
                    shadow="sm"
                    size="sm"
                    w="full"
                    rounded="md"
                    value={zip}
                    defaultValue={user?.zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </FormControl>
              </SimpleGrid>
            </Stack>
          </GridItem>
        </SimpleGrid>
      </Box>

      <Box visibility={{ base: "hidden", sm: "visible" }} aria-hidden="true">
        <Box py={5}>
          <Box
            borderTop="solid 1px"
            borderTopColor={useColorModeValue("gray.200", "whiteAlpha.200")}
          ></Box>
        </Box>
      </Box>

      <Box mt={[10, 0]}>
        <SimpleGrid
          display={{ base: "initial", md: "grid" }}
          columns={{ md: 3 }}
          spacing={{ md: 6 }}
        >
          <GridItem colSpan={{ md: 1 }}>
            <Box px={[4, 0]}>
              <Heading fontSize="lg" fontWeight="medium" lineHeight="6">
                Financials
              </Heading>
              <Text
                mt={1}
                fontSize="sm"
                color={useColorModeValue("gray.600", "gray.400")}
              >
                Fill in your bank account details for withdrawals.
              </Text>
            </Box>
          </GridItem>
          <GridItem mt={[5, null, 0]} colSpan={{ md: 2 }}>
            <chakra.form
              method="POST"
              shadow="base"
              rounded={[null, "md"]}
              overflow={{ sm: "hidden" }}
            >
              <Stack
                px={4}
                py={5}
                p={[null, 6]}
                bg={useColorModeValue("white", "gray.700")}
                spacing={6}
              >
                <Stack direction="row" spacing={3} flexWrap="wrap">
                  {/* PAN ATTACHMENTs */}
                  <GridItem colSpan={[6, null, null, 2]}>
                    <Stack
                      px={4}
                      py={5}
                      bg={useColorModeValue("white", "gray.700")}
                      spacing={2}
                      p={{ sm: 6 }}
                    >
                      <Text
                        fontSize="sm"
                        fontWeight="md"
                        color={useColorModeValue("gray.700", "gray.50")}
                      >
                        PAN Card Attachment
                      </Text>
                      <Stack direction="column" flexWrap="wrap" spacing={2}>
                        <Input
                          type="file"
                          ref={panRef}
                          // opacity="0"
                          display="none"
                          aria-hidden="true"
                          accept=".pdf, .jpg, .jpeg, .png"
                          onChange={(e) => setPanFile(e.target.files[0])}
                        />
                        <Input
                          type="text"
                          placeholder="PAN Number"
                          value={pan}
                          defaultValue={user?.pan?.id}
                          onChange={(e) => setPan(e.target.value)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          px={2}
                          onClick={() => panRef.current.click()}
                          // sx={{ alignSelf: "center" }}
                        >
                          Choose
                        </Button>
                        {panFile && (
                          <Text
                            fontSize="sm"
                            fontWeight="md"
                            color={useColorModeValue("gray.700", "gray.50")}
                            sx={{ alignSelf: "center" }}
                          >
                            Attached: {panFile.name}
                          </Text>
                        )}
                      </Stack>
                    </Stack>
                    {/* AADHAR ATTACHMENTs */}
                    <Stack
                      px={4}
                      py={5}
                      bg={useColorModeValue("white", "gray.700")}
                      spacing={2}
                      p={{ sm: 6 }}
                    >
                      <Text
                        fontSize="sm"
                        fontWeight="md"
                        color={useColorModeValue("gray.700", "gray.50")}
                      >
                        Aadhar File
                      </Text>
                      <Stack direction="column" flexWrap="wrap" spacing={2}>
                        <Input
                          type="file"
                          ref={aadharRef}
                          // opacity="0"
                          display="none"
                          aria-hidden="true"
                          accept=".pdf, .jpg, .jpeg, .png"
                          onChange={(e) => setAadharFile(e.target.files[0])}
                        />
                        <Input
                          type="text"
                          placeholder="Aadhar Number"
                          value={aadhar}
                          defaultValue={user?.aadhar?.id}
                          onChange={(e) => setAadhar(e.target.value)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          px={2}
                          onClick={() => aadharRef.current.click()}
                          // sx={{ alignSelf: "center" }}
                        >
                          Choose
                        </Button>
                        {aadharFile && (
                          <Text
                            fontSize="sm"
                            fontWeight="md"
                            color={useColorModeValue("gray.700", "gray.50")}
                            sx={{ alignSelf: "center" }}
                          >
                            Attached: {aadharFile.name}
                          </Text>
                        )}
                      </Stack>
                    </Stack>
                    {/* BANK DOCUMENTs */}
                    <Stack
                      px={4}
                      py={5}
                      bg={useColorModeValue("white", "gray.700")}
                      spacing={4}
                      p={{ sm: 6 }}
                    >
                      <Text
                        fontSize="sm"
                        fontWeight="md"
                        color={useColorModeValue("gray.700", "gray.50")}
                      >
                        Cancel Cheque / Bank Statement
                      </Text>
                      <Stack direction="column" flexWrap="wrap" spacing={2}>
                        <Input
                          type="file"
                          ref={bankDocumentRef}
                          // opacity="0"
                          display="none"
                          aria-hidden="true"
                          accept=".pdf, .jpg, .jpeg, .png"
                          onChange={(e) => setBankDocument(e.target.files[0])}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          px={2}
                          onClick={() => bankDocumentRef.current.click()}
                          // sx={{ alignSelf: "center" }}
                        >
                          Choose
                        </Button>
                        {bankDocument && (
                          <Text
                            fontSize="sm"
                            fontWeight="md"
                            color={useColorModeValue("gray.700", "gray.50")}
                            sx={{ alignSelf: "center" }}
                          >
                            Attached: {bankDocument.name}
                          </Text>
                        )}
                      </Stack>
                    </Stack>
                  </GridItem>
                </Stack>
                <Stack direction="row" spacing={3}>
                  <FormControl as={GridItem} colSpan={[6, 3]}>
                    <FormLabel
                      htmlFor="first_name"
                      fontSize="sm"
                      fontWeight="md"
                      color={useColorModeValue("gray.700", "gray.50")}
                    >
                      Bank Name
                    </FormLabel>
                    <Input
                      type="text"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
                      onChange={(e) => setBankName(e.target.value)}
                      value={bankName}
                      defaultValue={user?.bankAccount?.bankName}
                    />
                  </FormControl>{" "}
                  <FormControl as={GridItem} colSpan={[6, 3]}>
                    <FormLabel
                      htmlFor="first_name"
                      fontSize="sm"
                      fontWeight="md"
                      color={useColorModeValue("gray.700", "gray.50")}
                    >
                      Account No.
                    </FormLabel>
                    <Input
                      type="text"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
                      onChange={(e) => setBankAccountNo(e.target.value)}
                      value={bankAccountNo}
                      defaultValue={user?.bankAccount?.accountNo}
                    />
                  </FormControl>
                  <FormControl as={GridItem} colSpan={[6, 3]}>
                    <FormLabel
                      htmlFor="first_name"
                      fontSize="sm"
                      fontWeight="md"
                      color={useColorModeValue("gray.700", "gray.50")}
                    >
                      IFSC
                    </FormLabel>
                    <Input
                      type="text"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
                      onChange={(e) => setBankIfsc(e.target.value)}
                      value={bankIfsc}
                      defaultValue={user?.bankAccount?.ifsc}
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <FormControl as={GridItem} colSpan={[6, 3]}>
                    <FormLabel
                      htmlFor="first_name"
                      fontSize="sm"
                      fontWeight="md"
                      color={useColorModeValue("gray.700", "gray.50")}
                    >
                      Bank Branch Name
                    </FormLabel>
                    <Input
                      type="text"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
                      onChange={(e) => setBankBranch(e.target.value)}
                      value={bankBranch}
                      defaultValue={user?.bankAccount?.branch}
                    />
                  </FormControl>
                  <FormControl as={GridItem} colSpan={[6, 3]}>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="md"
                      color={useColorModeValue("gray.700", "gray.50")}
                    >
                      Account Type
                    </FormLabel>
                    <Select
                      placeholder="Select Account Type"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
                      onChange={(e) => setBankAccountType(e.target.value)}
                    >
                      <option>Savings</option>
                      <option>Current</option>
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>
            </chakra.form>
          </GridItem>
        </SimpleGrid>
      </Box>
      <Box visibility={{ base: "hidden", sm: "visible" }} aria-hidden="true">
        <Box py={5}>
          <Box
            borderTop="solid 1px"
            borderTopColor={useColorModeValue("gray.200", "whiteAlpha.200")}
          ></Box>
        </Box>
      </Box>
      <Box mt={[10, 0]}>
        <SimpleGrid
          display={{ base: "initial", md: "grid" }}
          columns={{ md: 3 }}
          spacing={{ md: 6 }}
        >
          <GridItem colSpan={{ md: 1 }}>
            <Box px={[4, 0]}>
              <Heading fontSize="lg" fontWeight="medium" lineHeight="6">
                Nominee Details
              </Heading>
              <Text
                mt={1}
                fontSize="sm"
                color={useColorModeValue("gray.600", "gray.400")}
              >
                Fill in your nominee details
              </Text>
            </Box>
          </GridItem>
          <GridItem mt={[5, null, 0]} colSpan={{ md: 2 }}>
            <Stack
              px={4}
              py={5}
              bg={useColorModeValue("white", "gray.700")}
              spacing={2}
              p={{ sm: 6 }}
            >
              <Text>Enter nominee name</Text>
              <Input
                value={nomineeName}
                onChange={(e) => setNomineeName(e.target.value)}
                type="text"
              />
              <Text>Enter nominee DOB</Text>
              <Input
                value={nomineeDOB}
                onChange={(e) => setNomineeDOB(e.target.value)}
                type="date"
              />
              <Text>Select relation Type</Text>
              <Select
                value={nomineeRelation}
                onChange={(e) => setNomineeRelation(e.target.value)}
              >
                {relations.map((relation) => (
                  <option key={relation.value} value={relation.value}>
                    {relation.option}
                  </option>
                ))}
              </Select>
            </Stack>
          </GridItem>
        </SimpleGrid>
      </Box>
      <Box
        sx={{
          display: "flex",
          my: 8,
          justifyContent: "flex-end",
          width: "100%",
        }}
      >
        <Button size="lg" onClick={handleUpdateNewUser}>
          SUBMIT
        </Button>
        {loading && <Text>Loading...</Text>}
      </Box>
    </Box>
  );
}
