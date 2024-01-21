import request from "supertest";
import { Ticket } from "../../models/ticket";
import { app } from "../../app";
import mongoose from "mongoose";

it("fetches the order", async () => {
  //Create a tickets
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();
  const user = global.signin();
  //make a request to build an order with this tickets
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  //make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("return an error if one user tried to fetch anther user order", async () => {
  //Create a tickets
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();
  const user1 = global.signin();
  const user2 = global.signin();
  //make a request to build an order with this tickets
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket.id })
    .expect(201);

  //make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user2)
    .send()
    .expect(401);
});
