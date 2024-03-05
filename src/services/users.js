import _ from "lodash";
import {
  getUserByFilters,
  getUserById,
  getUserByOptions,
  updateUserById,
} from "../controllers/users.js";
import {
  getStudentAssignmentSUbmissionByFilters,
  getStudentAssignmentSUbmissionByOptions,
} from "../controllers/studentAssignmentSubmissions.js";

export const fetchStudentAssignments = async (req, res, next) => {
  const { id } = req.params;
  const { sortBy = "id", sortValue = "asc" } = req.query;

  try {
    const user = await getUserByOptions({
      options: {
        includes: {
          studentClassrooms: {
            include: {
              assignments: {
                orderBy: {
                  [sortBy]: _.toLower(sortValue),
                },
              },
            },
          },
        },
        conditions: {
          id: parseInt(id, 10),
        },
      },
    });

    if (_.isEmpty(user)) {
      throw {
        name: "CustomError",
        message: "User does not exist",
        code: 422,
        details: "User does not exist",
      };
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: _.get(user, "studentClassrooms[0].assignments"),
    });
  } catch (err) {
    next(err);
  }
};

export const fetchUser = async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await getUserById({ id });

    if (_.isEmpty(user)) {
      throw {
        name: "CustomError",
        message: "User does not exist",
        code: 422,
        details: "User does not exist",
      };
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const modifyUser = async (req, res, next) => {
  const { id } = req.user;
  const { userData } = req.body;

  try {
    const user = await getUserById({ id });
    if (_.isEmpty(user)) {
      throw {
        name: "CustomError",
        message: "User does not exist",
        code: 422,
        details: "User does not exist",
      };
    }

    const updatedUser = await updateUserById({
      userId: id,
      newData: userData,
    });

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

export const removeUser = async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await getUserById({ id });
    if (_.isEmpty(user)) {
      throw {
        name: "CustomError",
        message: "User does not exist",
        code: 422,
        details: "User does not exist",
      };
    }

    const deletedUser = await updateUserById({
      userId: id,
      newData: {
        isDeleted: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: deletedUser,
    });
  } catch (err) {
    next(err);
  }
};

export const fetchReports = async (req, res, next) => {
  const { id } = req.params;
  const { sortBy = "id", sortValue = "asc" } = req.query;

  try {
    const reports = await getStudentAssignmentSUbmissionByOptions({
      options: {
        conditions: {
          studentId: parseInt(id, 10),
        },
        selection: {
          score: true,
          assignment: {
            select: {
              title: true,
              classroom: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    });

    if (_.isEmpty(reports)) {
      throw {
        name: "CustomError",
        message: "User does not exist",
        code: 422,
        details: "User does not exist",
      };
    }

    const newReports = _.map(reports, (report) => ({
      assignmentTitle: _.get(report, "assignment.title"),
      classroomTitle: _.get(report, "assignment.classroom.name"),
      score: _.get(report, "score"),
    }));

    res.status(200).json({
      success: true,
      message: "User's reportss fetched successfully",
      data: newReports,
    });
  } catch (err) {
    next(err);
  }
};
