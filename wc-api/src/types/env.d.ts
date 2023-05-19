import express from "express";

const { PORT, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT } =
  process.env;

interface EnvironmentVariables {
  PORT: number;

  DB_NAME: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: number;
}

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvironmentVariables {}
  }
}
