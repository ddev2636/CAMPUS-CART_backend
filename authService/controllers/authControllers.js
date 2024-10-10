import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { BadRequestError, UnauthenticatedError } from "../error/index.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  if (!name || !email || !password) {
    throw new BadRequestError("please provide all values");
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("user already exists");
  }
  const user = await User.create({ name, email, password });
  console.log(process.env.JWT_SECRET);
  let token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  console.log("token", token);
  const options = {
    expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: "None", //blunder
  };
  res.cookie("token", token, options);
  res.status(StatusCodes.CREATED).json({ user });
  console.log(name, email, password);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("please provide all values");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new UnauthenticatedError("user not found");
  }
  console.log(user);

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid creditials");
  }
  //
  let token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  const options = {
    expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: "None", //blunder
  };
  res.cookie("token", token, options);
  //
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user });
};
export { register, login };
