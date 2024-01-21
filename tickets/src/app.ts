import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { errorHandler, NotFoundError, currentUser } from "@eyaltickets/common";
import { createTicketsRouter } from "./routes/new";
import cookieSession from "cookie-session"; // now in res there is req.session property
import { showTicketsRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

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
app.use(createTicketsRouter);
app.use(showTicketsRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app }; //app is config of express
