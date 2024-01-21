import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";
import mongoose from "mongoose";

it("return a 404 if the tickets is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString(); //random mongoose id
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("return the ticket if the tickets found", async () => {
  const title = "concert";
  const price = 20;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketRespond = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketRespond.body.title).toEqual(title);
  expect(ticketRespond.body.price).toEqual(price);
});
