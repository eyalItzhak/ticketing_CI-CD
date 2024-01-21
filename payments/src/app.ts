import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { errorHandler, NotFoundError, currentUser } from "@eyaltickets/common";

import cookieSession from "cookie-session"; // now in res there is req.session property
import { createChargeRoute } from "./routes/new";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", //if true cookie sent when use https
  })
);
app.use(currentUser);

app.use(createChargeRoute);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app }; //app is config of express
