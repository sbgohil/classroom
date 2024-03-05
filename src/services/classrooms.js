import _ from "lodash";
import {
  getClassroomById,
  createClassroom,
  updateClassroomById,
  getClassroomByOpions,
} from "../controllers/classrooms.js";
import { getAssignmentsByClassroomId } from "../controllers/assignments.js";
import { getUserById } from "../controllers/users.js";

export const fetchClassroom = async (req, res, next) => {
  const { id } = req.params;

  try {
    const classroom = await getClassroomById({ classroomId: id });

    if (_.isEmpty(classroom)) {
      throw {
        name: "CustomError",
        message: "Classroom does not exist",
        code: 422,
        details: "Classroom does not exist",
      };
    }

    return res.status(200).json({
      success: true,
      message: "Classroom fetched successfully",
      data: classroom,
    });
  } catch (err) {
    return next(err);
  }
};

export const addClassroom = async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.user;

  try {
    const classroom = await createClassroom({
      classroomData: {
        name,
        teacherId: id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Classroom created successfully",
      data: classroom,
    });
  } catch (err) {
    next(err);
  }
};

export const modifyClassroom = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const classroom = await getClassroomById({ classroomId: id });

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

    const updatedClassroom = await updateClassroomById({
      classroomId: id,
      newData: {
        name,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Classroom updated successfully",
      data: updatedClassroom,
    });
  } catch (err) {
    next(err);
  }
};

export const removeClassroom = async (req, res, next) => {
  const { id } = req.params;

  try {
    const classroom = await getClassroomById({ classroomId: id });

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

    const updatedClassroom = await updateClassroomById({
      classroomId: id,
      newData: {
        isDeleted: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Classroom deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const fetchClassroomAssignments = async (req, res, next) => {
  const { id } = req.params;
  const { sortBy = "id", sortValue = "asc" } = req.query;
  try {
    const classroom = await getClassroomById({ classroomId: id });

    if (_.isEmpty(classroom)) {
      throw {
        name: "CustomError",
        message: "Classroom does not exist",
        code: 422,
        details: "Classroom does not exist",
      };
    }

    const assignments = await getAssignmentsByClassroomId({
      classroomId: id,
      orderBy: {
        [sortBy]: _.toLower(sortValue),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Classroom assignments fetched successfully",
      data: assignments,
    });
  } catch (err) {
    next(err);
  }
};

export const addStudentToClassroom = async (req, res, next) => {
  const { id } = req.params;
  const { studentIds } = req.body;

  try {
    const classroom = await getClassroomByOpions({
      options: {
        includes: {
          students: true,
        },
        conditions: {
          id: parseInt(id, 10),
        },
      },
    });

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

    const promises = studentIds.map((studentId) =>
      getUserById({ userId: studentId })
    );

    const students = await Promise.all(promises);

    students.forEach((student) => {
      if (_.isEmpty(student)) {
        throw {
          name: "CustomError",
          message: "Student does not exist",
          code: 422,
          details: "Student does not exist",
        };
      }
    });

    const updateStudentIds = [
      ...classroom.students.map((student) => student.id),
      ...studentIds,
    ];

    const updatedClassroom = await updateClassroomById({
      classroomId: id,
      newData: {
        students: {
          connect: updateStudentIds.map((studentId) => ({ id: studentId })),
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Student added to classroom successfully",
      data: updatedClassroom,
    });
  } catch (err) {
    next(err);
  }
};
