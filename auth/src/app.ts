import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { singinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@eyaltickets/common";

import cookieSession from "cookie-session"; // now in res there is req.session property

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", //if true cookie sent when use https
  })
);

app.use(currentUserRouter);
app.use(singinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app }; //app is config of express
