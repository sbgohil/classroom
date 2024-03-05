import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "lodash";

import {
  createUser,
  getUserByFilters,
  generateAccessAndRefreshTokens,
  getUserById,
  generateAccessTokens,
  updateUserById,
} from "../controllers/users.js";
import { sendEmail } from "./mail.js";

export const addUser = async (req, res, next) => {
  const { firstname, lastname, email, password, role } = req.body;

  try {
    if (
      _.isEmpty(firstname) ||
      _.isEmpty(lastname) ||
      _.isEmpty(email) ||
      _.isEmpty(password) ||
      _.isEmpty(role)
    ) {
      throw {
        name: "CustomError",
        message: "All fields are required",
        code: 400,
        details: "Every field is required, check for empty fields",
      };
    }

    // check if entity exsits or not
    const user = await getUserByFilters({
      filters: {
        conditions: {
          email: email.toLowerCase(),
        },
      },
    });

    if (!_.isEmpty(user)) {
      throw {
        name: "CustomError",
        message: "User already exists",
        code: 400,
        details: "User already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userOtp = Math.floor(100000 + Math.random() * 900000);

    const data = await createUser({
      firstName: firstname,
      lastName: lastname,
      email: email,
      password: hashedPassword,
      otp: `${userOtp}`,
      role: role,
    });

    const { success, error } = await sendEmail({
      emails: [email],
      subject: "Verify your email",
      body: `Hi ${firstname},\n\nPlease use this OTP to verify your email: ${userOtp}\n\nRegards\nClassroom Team`,
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      otpSent: success,
    });
  } catch (err) {
    next(err);
  }
};

export const verifyUser = async (req, res, next) => {
  const { otp } = req.body;
  const { email } = req.params;

  try {
    if (_.isEmpty(otp)) {
      throw {
        name: "CustomError",
        message: "Sent required fields",
        code: 400,
        details: "OTP is required, check for empty fields",
      };
    }

    const user = await getUserByFilters({
      filters: {
        conditions: {
          email: email.toLowerCase(),
        },
      },
    });

    if (_.isEmpty(user)) {
      throw {
        name: "CustomError",
        message: "User does not exists",
        code: 404,
        details: "User is not registered",
      };
    }

    if (user[0].otp !== otp) {
      throw {
        name: "CustomError",
        message: "Invalid OTP",
        code: 400,
        details: "Invalid OTP",
      };
    }

    await updateUserById({
      userId: user[0].id,
      newData: {
        otp: null,
        verified: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (_.isEmpty(password) || _.isEmpty(email)) {
      throw {
        name: "CustomError",
        message: "Sent required fields",
        code: 400,
        details: "Password and email are required, check for empty fields",
      };
    }

    const user = await getUserByFilters({
      filters: {
        conditions: {
          email: email.toLowerCase(),
        },
      },
    });

    if (_.isEmpty(user)) {
      throw {
        name: "CustomError",
        message: "User does not exists",
        code: 404,
        details: "User is not registered",
      };
    }

    const passCheck = await bcrypt.compare(password, user[0].password);

    if (!passCheck) {
      throw {
        name: "CustomError",
        message: "Invalid credential",
        code: 401,
        details: "Wrong Password",
      };
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens({
      userId: _.get(user[0], "id"),
    });

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        success: true,
        message: "Logged in successfully",
        data: {
          refreshToken,
          accessToken,
        },
      });
  } catch (err) {
    next(err);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  const refreshToken = _.get(
    req,
    "cookies.refreshToken",
    _.get(req, "body.refreshToken")
  );

  try {
    if (_.isNil(refreshToken)) {
      throw {
        name: "UnauthorizedError",
        errors: "Missing Refresh Token",
      };
    }

    const decodedToken = jwt.verify(
      refreshToken,
      process.env.SECRET_REFRESH_TOKEN
    );

    if (_.isNil(decodedToken)) {
      throw {
        name: "CustomError",
        code: "403",
        message: "Invalid Refresh Token",
        details: "Cannot decode refresh token",
      };
    }

    const user = await getUserById({ id: _.get(decodedToken, "id") });

    if (_.isNil(user)) {
      throw {
        name: "CustomError",
        code: "403",
        message: "Forbidden",
        details: "User does not exists",
      };
    }

    const { accessToken } = await generateAccessTokens({
      userId: _.get(user, "_id"),
    });

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res.status(200).cookie("accessToken", accessToken, options).json({
      message: "Access Token Refreshed",
      data: {
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logoutUser = async (req, res) => {
  const user = await updateUserById({
    userId: _.get(req, "user.id"),
    newData: { token: null },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      success: true,
      message: "Logged out successfully",
    });
};

export const resendOtp = async (req, res, next) => {
  const { email, id } = req.user;

  try {
    if (_.isEmpty(email)) {
      throw {
        name: "CustomError",
        message: "Sent required fields",
        code: 400,
        details: "Email is required, check for empty fields",
      };
    }

    const user = await getUserByFilters({
      filters: {
        conditions: {
          email: email.toLowerCase(),
        },
      },
    });

    const userOtp = Math.floor(100000 + Math.random() * 900000);

    await updateUserById({
      userId: id,
      newData: { otp: `${userOtp}` },
    });

    const { success, error } = await sendEmail({
      emails: [email],
      subject: "Verify your email",
      body: `Hi ${_.get(user, "[0].firstname")},\n\nPlease use this OTP to verify your email: ${userOtp}\n\nRegards\nClassroom Team`,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    next(err);
  }
};
