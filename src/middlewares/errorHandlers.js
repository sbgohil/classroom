import _ from "lodash";

export const errorHandler = (err, req, res, next) => {
  let responseCode = 500,
    responseObj = {
      success: false,
      message: "Unexpected error occurred",
      error: {
        code: "500",
        details: _.get(err, "errors"),
      },
    };

  // Different responses based on error type
  if (err.name === "ValidationError") {
    responseCode = 400;
    responseObj = {
      success: false,
      message: "Invalid request data",
      error: {
        code: "400",
        details: _.get(err, "errors"),
      },
    };
  } else if (err.name === "UnauthorizedError") {
    responseCode = 401;
    responseObj = {
      success: false,
      message: "Unauthorized access",
      error: {
        code: "401",
        details: _.get(err, "errors"),
      },
    };
  } else if (err.name === "ServerError") {
    responseCode = 500;
    responseObj = {
      success: false,
      message: "Internal server error",
      error: {
        code: "500",
        details: _.get(err, "errors"),
      },
    };
  } else if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    responseCode = 400;
    responseObj = {
      success: false,
      message: "Invalid access token",
      error: {
        code: "400",
        details: "Invalid access token or token expired",
      },
    };
    // Our custom error handler
  } else if (err.name === "CustomError") {
    responseCode = _.get(err, "code");
    responseObj = {
      success: false,
      message: _.get(err, "message"),
      error: {
        code: _.get(err, "code"),
        details: _.get(err, "details"),
      },
    };
  }

  res.status(responseCode).json(responseObj);
  next(err);
};

export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Check the URL and try again",
    error: {
      code: "404",
      details: _.get(req, "url"),
    },
  });
  next();
};
