import jwt from "jsonwebtoken";

import { db } from "../config/db.js";

export const getUserById = async (data) => {
  const { id } = data;

  const user = await db.users.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    },
  });

  return user;
};

export const getUserByOptions = async (data) => {
  const { options } = data;
  const { includes, conditions, orderBy } = options;

  const user = await db.users.findFirst({
    where: {
      ...conditions,
    },
    include: includes,
    orderBy,
  });

  return user;
};

export const getUserByFilters = async (data) => {
  const { filters } = data;
  const { conditions, selection } = filters;

  const user = await db.users.findMany({
    where: conditions,
    select: selection,
  });

  return user;
};

export const createUser = async (data) => {
  const user = await db.users.create({
    data,
  });

  return user;
};

export const generateAccessAndRefreshTokens = async (data) => {
  const { userId } = data;

  // fetch user
  const user = await getUserById({
    id: userId,
  });

  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.SECRET_ACCESS_TOKEN,
    {
      expiresIn: process.env.SECRET_ACCESS_TOKEN_EXPIRY,
    }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.SECRET_REFRESH_TOKEN,
    {
      expiresIn: process.env.SECRET_REFRESH_TOKEN_EXPIRY,
    }
  );

  const updatedUser = await updateUserById({
    userId,
    newData: {
      token: refreshToken,
    },
  });
  return { accessToken, refreshToken, userData: updatedUser };
};

export const generateAccessTokens = async (data) => {
  const { userId } = data;

  // fetch user
  const user = await getUserById({
    id: userId,
  });

  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.SECRET_ACCESS_TOKEN,
    {
      expiresIn: process.env.SECRET_ACCESS_TOKEN_EXPIRY,
    }
  );

  return { accessToken };
};

export const updateUserById = async (data) => {
  const { userId, newData } = data;

  const user = await db.users.update({
    where: {
      id: userId,
    },
    data: newData,
  });

  return user;
};
