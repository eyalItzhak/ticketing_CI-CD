import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { errorHandler, NotFoundError, currentUser } from "@eyaltickets/common";

import cookieSession from "cookie-session"; // now in res there is req.session property
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { deleteOrderRouter } from "./routes/delete";
import { indexOrderRouter } from "./routes/index";

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
app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app }; //app is config of express
