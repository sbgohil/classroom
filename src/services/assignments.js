import _ from "lodash";

import {
  createAssignment,
  getAssignmentById,
  updateAssignmentById,
  getAssignmentsByTeacherId,
} from "../controllers/assignments.js";
import {
  getClassroomById,
  getClassroomByOpions,
} from "../controllers/classrooms.js";
import { sendEmail } from "./mail.js";

export const addAssignment = async (req, res, next) => {
  const { title, description, dueDate, totalScore, classroomId } = req.body;

  try {
    const classroom = await getClassroomById({ classroomId });

    if (_.isEmpty(classroom)) {
      throw {
        name: "CustomError",
        message: "Classroom does not exist",
        code: 422,
        details: "Classroom does not exist",
      };
    }

    if (classroom.teacherId !== req.user.id) {
      throw {
        name: "CustomError",
        message: "Classroom does not belong to Teacher",
        code: 422,
        details: "Classroom does not belong to Teacher",
      };
    }

    const assignment = await createAssignment({
      assignmentData: {
        title,
        description,
        dueDate,
        totalScore,
        classroomId,
        teacherId: req.user.id,
      },
    });

    const classStudents = await getClassroomByOpions({
      options: {
        includes: {
          students: {
            select: {
              email: true,
            },
          },
        },
        conditions: {
          id: parseInt(classroom.id, 10),
        },
      },
    });

    // get array of emails object to array of string
    const emails = _.map(_.get(classStudents, "students"), "email");

    const { success, error } = await sendEmail({
      emails,
      subject: "New Assignment",
      body: `New assignment created: ${assignment.title}. In Class: ${classroom.name}, Due Date: ${assignment.dueDate}.`,
    });

    return res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: assignment,
      notificationStatus: success,
    });
  } catch (err) {
    next(err);
  }
};

export const fetchAssignment = async (req, res, next) => {
  const { id } = req.params;

  try {
    const assignment = await getAssignmentById({ assignmentId: id });

    if (_.isEmpty(assignment)) {
      throw {
        name: "CustomError",
        message: "Assignment does not exist",
        code: 422,
        details: "Assignment does not exist",
      };
    }

    return res.status(200).json({
      success: true,
      message: "Assignment fetched successfully",
      data: assignment,
    });
  } catch (err) {
    next(err);
  }
};

export const modifyAssignment = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, dueDate, totalScore } = req.body;
  try {
    const assignment = await getAssignmentById({ assignmentId: id });

    if (_.isEmpty(assignment)) {
      throw {
        name: "CustomError",
        message: "Assignment does not exist",
        code: 422,
        details: "Assignment does not exist",
      };
    }

    if (assignment.teacherId !== req.user.id) {
      throw {
        name: "CustomError",
        message: "Assignment does not belong to Teacher",
        code: 422,
        details: "Assignment does not belong to Teacher",
      };
    }

    const updatedAssignment = await updateAssignmentById({
      assignmentId: id,
      newData: {
        title,
        description,
        dueDate,
        totalScore,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Assignment updated successfully",
      data: updatedAssignment,
    });
  } catch (err) {
    next(err);
  }
};

export const removeAssignment = async (req, res, next) => {
  const { id } = req.params;

  try {
    const assignment = await getAssignmentById({ assignmentId: id });

    if (_.isEmpty(assignment)) {
      throw {
        name: "CustomError",
        message: "Assignment does not exist",
        code: 422,
        details: "Assignment does not exist",
      };
    }

    if (assignment.teacherId !== req.user.id) {
      throw {
        name: "CustomError",
        message: "Assignment does not belong to Teacher",
        code: 422,
        details: "Assignment does not belong to Teacher",
      };
    }

    const deletedAssignment = await updateAssignmentById({
      assignmentId: id,
      newData: {
        isDeleted: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const fetchAllAssignments = async (req, res, next) => {
  const { sortBy = "id", sortValue = "asc" } = req.query;
  try {
    const assignments = await getAssignmentsByTeacherId({
      teacherId: req.user.id,
      orderBy: {
        [sortBy]: _.toLower(sortValue),
      },
    });
    return res.status(200).json({
      success: true,
      message: "Assignments fetched successfully",
      data: assignments,
    });
  } catch (err) {
    next(err);
  }
};
