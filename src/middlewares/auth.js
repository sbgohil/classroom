// lib imports
import jwt from "jsonwebtoken";
import _ from "lodash";

// server imports
import { getUserById } from "../controllers/users.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token = _.get(
      req,
      "cookies.accessToken",
      (_.get(req, "headers.authorization") || "").replace(/^Bearer\s+/i, "")
    );

    if (_.isEmpty(token)) {
      throw {
        name: "CustomError",
        message: "Provide access token",
        code: 400,
        details: "Access token is required",
      };
    }

    // decode token
    const decodedToken = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);

    if (_.isEmpty(decodedToken)) {
      throw {
        name: "InvalidAToken",
        message: "Invalid access token",
        code: 400,
        details: "Invalid access token",
      };
    }

    const user = await getUserById({ id: _.get(decodedToken, "id") });

    if (_.isEmpty(user)) {
      throw {
        name: "CustomError",
        message: "Invalid access token",
        code: 400, // HTTP status code
        details: "Invalid access token or user not found",
      };
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const verifyTeacher = async (req, res, next) => {
  const { role } = req.user;
  try {
    if (role !== "TEACHER") {
      throw {
        name: "CustomError",
        message: "Unauthorized",
        code: 401,
        details: "Only teachers can perform this action",
      };
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const verifyStudent = async (req, res, next) => {
  const { role } = req.user;

  try {
    if (role !== "STUDENT") {
      throw {
        name: "CustomError",
        message: "Unauthorized",
        code: 401,
        details: "Only students can perform this action",
      };
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const verifyAdmin = async (req, res, next) => {
  const { role } = req.user;
  try {
    if (role !== "ADMIN") {
      throw {
        name: "CustomError",
        message: "Unauthorized",
        code: 401,
        details: "Only admins can perform this action",
      };
    }
    next();
  } catch (err) {
    next(err);
  }
};
