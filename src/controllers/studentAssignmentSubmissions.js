import _ from "lodash";
import { db } from "../config/db.js";
import express from "express";

export const createStudentAssignmentSubmission = async (data) => {
  const { submissionData } = data;

  const submission = await db.studentAssignmentSubmissions.create({
    data: submissionData,
  });

  return submission;
};

export const updateStudentAssignmentSubmissionById = async (data) => {
  const { submissionId, newData } = data;

  const submission = await db.studentAssignmentSubmissions.update({
    where: {
      id: parseInt(submissionId, 10),
    },
    data: newData,
  });

  return submission;
};

export const getStudentAssignmentSubmissionById = async (data) => {
  const { submissionId } = data;

  const submission = await db.studentAssignmentSubmissions.findFirst({
    where: {
      id: parseInt(submissionId, 10),
    },
  });

  return submission;
};

export const getStudentAssignmentSUbmissionByFilters = async (data) => {
  const { filters } = data;
  const { conditions, selection, orderBy } = filters;

  const submissions = await db.studentAssignmentSubmissions.findMany({
    where: conditions,
    select: selection,
    orderBy,
  });

  return submissions;
};

export const getStudentAssignmentSUbmissionByOptions = async (data) => {
  const { options } = data;
  const { includes, conditions, orderBy, selection } = options;

  const submissions = await db.studentAssignmentSubmissions.findMany({
    where: conditions,
    include: includes,
    select: selection,
    orderBy,
  });

  return submissions;
};
