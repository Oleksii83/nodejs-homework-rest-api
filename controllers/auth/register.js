const { Conflict } = require("http-errors");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");
const { sendMail } = require("../../helpers");

const { User } = require("../../model");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new Conflict(`User with email=${email} allready exist`);
  }
  const verificationToken = nanoid();
  const avatar = gravatar.url(email);
  const newUser = new User({ email, avatar, verificationToken });

  newUser.setPassword(password);
  await newUser.save();

  const mail = {
    to: email,
    subject: "Registration confirmation",
    html: `<a href="http://localhost:3000/api/auth/verify/${verificationToken}">Click here to confirm your email</a>`,
  };

  await sendMail(mail);

  res.status(201).json({
    status: "success",
    code: 201,
    message: "Register success",
  });
};

module.exports = register;
