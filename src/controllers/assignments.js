import _ from "lodash";

import { db } from "../config/db.js";

export const getAssignmentById = async (data) => {
  const { assignmentId } = data;
  const assignment = await db.assignments.findFirst({
    where: {
      id: parseInt(assignmentId, 10),
    },
  });
  return assignment;
};

export const getAssignmentsByClassroomId = async (data) => {
  const { classroomId, orderBy } = data;

  const assignments = await db.assignments.findMany({
    where: {
      classroomId: parseInt(classroomId, 10),
    },
    orderBy,
  });

  return assignments;
};

export const getAssignmentsByTeacherId = async (data) => {
  const { teacherId, orderBy } = data;

  const assignments = await db.assignments.findMany({
    where: {
      teacherId: parseInt(teacherId, 10),
    },
    orderBy,
  });

  return assignments;
};

export const createAssignment = async (data) => {
  const { assignmentData } = data;
  const assignment = await db.assignments.create({
    data: assignmentData,
  });
  return assignment;
};

export const updateAssignmentById = async (data) => {
  const { assignmentId, newData } = data;

  const assignment = await db.assignments.update({
    where: {
      id: parseInt(assignmentId, 10),
    },
    data: newData,
  });

  return assignment;
};
