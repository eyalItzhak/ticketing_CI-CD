import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/tickets for post request", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if user is sign in ", async () => {
  const response = await request(app).post("/api/tickets").send({}).expect(401);
});

it("return a status other that 401 if the user is sign in ", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("return an error if a invalid title is provider", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "", price: 10 })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ price: 10 })
    .expect(400);
});

it("return an error if a invalid price is provider", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "showTitle", price: -10 })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "showTitle" })
    .expect(400);
});

it("create a tickets with valid inputs", async () => {
  //add in a cheack to make sure a tickets was saved
  let tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);

  const requestData = { title: "showTitle", price: 20 };

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: requestData.title, price: requestData.price })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(requestData.price);
  expect(tickets[0].title).toEqual(requestData.title);
});

it("publishes an event", async () => {
  const requestData = { title: "showTitle", price: 20 };

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: requestData.title, price: requestData.price })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled(); // see if natsWrapper.client.publish function call somewhere
});
