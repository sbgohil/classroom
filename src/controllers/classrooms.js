import _ from "lodash";
import { db } from "../config/db.js";

export const getClassroomById = async (data) => {
  const { classroomId } = data;

  const classroom = await db.classrooms.findFirst({
    where: {
      id: parseInt(classroomId, 10),
    },
  });

  return classroom;
};

export const getClassroomByOpions = async (data) => {
  const { options } = data;
  const { includes, conditions } = options;

  const classroom = await db.classrooms.findFirst({
    where: {
      ...conditions,
    },
    include: includes,
  });

  return classroom;
};

export const getClassroomsByTeacherId = async (data) => {
  const { teacherId } = data;

  const classrooms = await db.classrooms.findMany({
    where: {
      teacherId: parseInt(teacherId, 10),
    },
  });

  return classrooms;
};

export const updateClassroomById = async (data) => {
  const { classroomId, newData } = data;

  const classroom = await db.classrooms.update({
    where: {
      id: parseInt(classroomId, 10),
    },
    data: newData,
  });

  return classroom;
};

export const createClassroom = async (data) => {
  const { classroomData } = data;

  const classroom = await db.classrooms.create({
    data: classroomData,
  });

  return classroom;
};
