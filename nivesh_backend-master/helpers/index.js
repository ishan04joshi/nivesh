const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const User = require("../schema/User");
const createFolders = () => {
  const uploadsExists = fs.existsSync(path.join(__dirname, "../", "uploads"));
  if (!uploadsExists) fs.mkdirSync(path.join(__dirname, "../", "uploads"));

  const usersExists = fs.existsSync(
    path.join(__dirname, "../", "uploads", "users")
  );
  if (!usersExists)
    fs.mkdirSync(path.join(__dirname, "../", "uploads", "users"));

  const fundsExits = fs.existsSync(
    path.join(__dirname, "../", "uploads", "funds")
  );
  if (!fundsExits)
    fs.mkdirSync(path.join(__dirname, "../", "uploads", "funds"));
};
function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }

  response.type = matches[1];
  response.data = new Buffer.from(matches[2], "base64");

  return response;
}

const writeNewImage = async (name, image) => {
  const base64Data = `data:image/jpeg;base64,${image}`;
  const imageBuffer = decodeBase64Image(base64Data);
  const fileName = `${
    name.toLowerCase().replace(" ", "") + uuidv4().substring(0, 5)
  }.jpeg`;
  const filePath = path.join(__dirname, "../", "uploads", "faces", fileName);

  fs.writeFileSync(filePath, imageBuffer.data, (err) => {
    if (err) {
      console.log(err);
      throw err;
    }
  });
  return fileName;
};

const generateId = (req, res, next) => {
  const id = String(new mongoose.Types.ObjectId());
  req._id = id;
  next();
};
const createFolder = (req, res, next) => {
  const folderName = req._id.toString();
  fs.mkdirSync(path.join(__dirname, "../", "uploads", "funds", folderName));
  next();
};

const uploadEmployee = [
  {
    name: "aadhar",
    maxCount: 1,
  },
  {
    name: "pan",
    maxCount: 1,
  },
  {
    name: "avatar",
    maxCount: 1,
  },
  {
    name: "signature",
    maxCount: 1,
  },
  {
    name: "tenthMarksheet",
    maxCount: 1,
  },
  {
    name: "twelthMarksheet",
    maxCount: 1,
  },
  {
    name: "degree",
    maxCount: 1,
  },
  {
    name: "blankCheque",
    maxCount: 1,
  },
  {
    name: "accountStatement",
    maxCount: 1,
  },
];

const decrypt = (encrypted, key) => {
  var decipher = crypto.createDecipheriv(
    "AES-128-CBC",
    key,
    "@@@@&&&&####$$$$"
  );
  var decrypted = decipher.update(encrypted, "base64", "binary");
  try {
    decrypted += decipher.final("binary");
  } catch (e) {
    console.log(e);
  }
  return decrypted;
};
const calculateHash = (params, salt) => {
  var finalString = params + "|" + salt;
  return crypto.createHash("sha256").update(finalString).digest("hex") + salt;
};
const verifySignature = (params, key, checksum) => {
  const paytm_hash = decrypt(checksum, key);
  const salt = paytm_hash.substr(paytm_hash.length - 4);
  return paytm_hash === calculateHash(params, salt);
};
const sendToAdmins = async (message) => {
  try {
    // const admins = await User.find({ isAdmin: true });
    await User.updateMany(
      {
        isAdmin: true,
      },
      {
        $push: {
          mailbox: message,
        },
      }
    );
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  createFolders,
  decodeBase64Image,
  writeNewImage,
  generateId,
  uploadEmployee,
  createFolder,
  decrypt,
  calculateHash,
  verifySignature,
  sendToAdmins,
};

