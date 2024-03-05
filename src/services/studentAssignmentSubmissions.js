import _ from "lodash";

import {
  createStudentAssignmentSubmission,
  getStudentAssignmentSubmissionById,
  updateStudentAssignmentSubmissionById,
} from "../controllers/studentAssignmentSubmissions.js";
import { getClassroomById } from "../controllers/classrooms.js";
import { getAssignmentById } from "../controllers/assignments.js";

export const fetchStudentAssignmentSubmission = async (req, res, next) => {
  const { id } = req.params;

  try {
    const studentAssignmentSubmission =
      await getStudentAssignmentSubmissionById({
        submissionId: id,
      });

    if (_.isEmpty(studentAssignmentSubmission)) {
      throw {
        name: "CustomError",
        message: "Student Assignment Submission does not exist",
        code: 422,
        details: "Student Assignment Submission does not exist",
      };
    }

    return res.status(200).json({
      success: true,
      message: "Student Assignment Submission fetched successfully",
      data: studentAssignmentSubmission,
    });
  } catch (err) {
    return next(err);
  }
};

export const addStudentAssignmentSubmission = async (req, res, next) => {
  const { submissionData } = req.body;
  const { id } = req.user;

  try {
    const assignment = await getAssignmentById({
      assignmentId: _.get(submissionData, "assignmentId"),
    });

    if (_.isEmpty(assignment)) {
      throw {
        name: "CustomError",
        message: "Assignment does not exist",
        code: 422,
        details: "Assignment does not exist",
      };
    }

    const studentAssignmentSubmission = await createStudentAssignmentSubmission(
      {
        submissionData: {
          studentId: id,
          ...submissionData,
        },
      }
    );

    return res.status(201).json({
      success: true,
      message: "Student Assignment Submission created successfully",
      data: studentAssignmentSubmission,
    });
  } catch (err) {
    return next(err);
  }
};

export const modifyStudentAssignmentSubmission = async (req, res, next) => {
  const { id } = req.params;
  const { submissionData } = req.body;

  try {
    const studentAssignmentSubmission =
      await getStudentAssignmentSubmissionById({
        submissionId: id,
      });

    if (_.isEmpty(studentAssignmentSubmission)) {
      throw {
        name: "CustomError",
        message: "Student Assignment Submission does not exist",
        code: 422,
        details: "Student Assignment Submission does not exist",
      };
    }

    const { assignmentId } = submissionData;

    const assignment = await getAssignmentById({
      assignmentId,
    });

    if (_.isEmpty(assignment)) {
      throw {
        name: "CustomError",
        message: "Assignment does not exist",
        code: 422,
        details: "Assignment does not exist",
      };
    }

    const updatedStudentAssignmentSubmission =
      await updateStudentAssignmentSubmissionById({
        submissionId: id,
        newData: submissionData,
      });

    return res.status(200).json({
      success: true,
      message: "Student Assignment Submission updated successfully",
      data: updatedStudentAssignmentSubmission,
    });
  } catch (err) {
    return next(err);
  }
};

export const removeStudentAssignmentSubmission = async (req, res, next) => {
  const { id } = req.params;

  try {
    const studentAssignmentSubmission =
      await getStudentAssignmentSubmissionById({
        submissionId: id,
      });

    if (_.isEmpty(studentAssignmentSubmission)) {
      throw {
        name: "CustomError",
        message: "Student Assignment Submission does not exist",
        code: 422,
        details: "Student Assignment Submission does not exist",
      };
    }

    if (studentAssignmentSubmission.studentId !== req.user.id) {
      throw {
        name: "CustomError",
        message: "Student Assignment Submission does not belong to Student",
        code: 422,
        details: "Student Assignment Submission does not belong to Student",
      };
    }

    const deletedStudentAssignmentSubmission =
      await updateStudentAssignmentSubmissionById({
        submissionId: id,
        newData: {
          isDeleted: true,
        },
      });

    return res.status(200).json({
      success: true,
      message: "Student Assignment Submission deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const addResults = async (req, res, next) => {
  const { id } = req.params;
  const { results } = req.body;

  try {
    const studentAssignmentSubmission =
      await getStudentAssignmentSubmissionById({
        submissionId: id,
      });

    if (_.isEmpty(studentAssignmentSubmission)) {
      throw {
        name: "CustomError",
        message: "Student Assignment Submission does not exist",
        code: 422,
        details: "Student Assignment Submission does not exist",
      };
    }

    const { assignmentId } = studentAssignmentSubmission;

    const assignment = await getAssignmentById({
      assignmentId,
    });

    if (assignment.teacherId !== req.user.id) {
      throw {
        name: "CustomError",
        message: "Assignment does not belong to Teacher",
        code: 422,
        details: "Assignment does not belong to Teacher",
      };
    }

    if (results.score > assignment.totalScore) {
      throw {
        name: "CustomError",
        message: "Total score does not match",
        code: 422,
        details: "Total score does not match",
      };
    }

    const updatedStudentAssignmentSubmission =
      await updateStudentAssignmentSubmissionById({
        submissionId: id,
        newData: results,
      });

    return res.status(200).json({
      success: true,
      message: "Student Assignment Submission updated successfully",
      data: updatedStudentAssignmentSubmission,
    });
  } catch (err) {
    next(err);
  }
};
